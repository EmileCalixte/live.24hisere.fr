import React from "react";
import {
    faCheck,
    faFileArrowUp,
    faWandMagicSparkles,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Col, Row } from "react-bootstrap";
import { GENDER_OPTIONS } from "../../../../constants/forms";
import { type Gender } from "../../../../constants/gender";
import { ImportCsvColumn } from "../../../../constants/importCsv";
import { getAdminRaces } from "../../../../services/api/RaceService";
import {
    getAdminRunners,
    postAdminRunnersBulk,
} from "../../../../services/api/RunnerService";
import ToastService from "../../../../services/ToastService";
import { type PostAdminRunnersBulkApiRequest } from "../../../../types/api/RunnerApiRequests";
import { type SelectOption } from "../../../../types/Forms";
import {
    type RunnerFromCsv,
    type RunnersCsvMapping,
} from "../../../../types/ImportCsv";
import type { AdminRace, RaceDict } from "../../../../types/Race";
import type { Runner } from "../../../../types/Runner";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { getRunnerFromCsv, parseCsv } from "../../../../utils/csvUtils";
import { getRaceDictFromRaces } from "../../../../utils/raceUtils";
import { harmonizeName } from "../../../../utils/stringUtils";
import { appContext } from "../../../App";
import Breadcrumbs from "../../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../../ui/breadcrumbs/Crumb";
import { Input } from "../../../ui/forms/Input";
import Select from "../../../ui/forms/Select";
import Page from "../../../ui/Page";
import CsvMapping from "../../../viewParts/admin/runners/importCsv/CsvMapping";

const DEFAULT_MAPPING: RunnersCsvMapping = {
    [ImportCsvColumn.ID]: null,
    [ImportCsvColumn.LASTNAME]: null,
    [ImportCsvColumn.FIRSTNAME]: null,
    [ImportCsvColumn.BIRTH_YEAR]: null,
    [ImportCsvColumn.GENDER]: null,
};

interface RunnerToImport<
    T extends Partial<RunnerFromCsv> = Partial<RunnerFromCsv>,
> {
    /**
     * If false, the runner should not be included in import API request
     */
    toImport: boolean;

    runner: T;
}

function hasRunnerFromCsvAllRequiredData(
    runner: Partial<RunnerFromCsv>,
): runner is RunnerFromCsv {
    const requiredKeys = ["id", "firstname", "lastname", "birthYear", "gender"];

    if (!requiredKeys.every((key) => key in runner)) {
        return false;
    }

    return Object.values(runner).every((value) => {
        if (value === undefined || value === "") {
            return false;
        }

        return !(typeof value === "number" && isNaN(value));
    });
}

export default function ImportRunnersCsvView(): React.ReactElement {
    const {
        user: { accessToken },
    } = React.useContext(appContext);

    // false = not fetched yet
    const [runners, setRunners] = React.useState<Runner[] | false>(false);

    // false = not fetched yet
    const [races, setRaces] = React.useState<RaceDict<AdminRace> | false>(
        false,
    );

    const [selectedRaceId, setSelectedRaceId] = React.useState<number | null>(
        null,
    );

    const [csvData, setCsvData] = React.useState<string[][] | null>(null);
    const [runnersCsvMapping, setRunnersCsvMapping] =
        React.useState<RunnersCsvMapping>({ ...DEFAULT_MAPPING });
    const [isMappingValidated, setIsMappingValidated] = React.useState(false);

    // The runners from CSV data
    const [runnersFromCsv, setRunnersFromCsv] = React.useState<
        Array<Partial<RunnerFromCsv>>
    >([]);

    // The runners displayed in import form for import preparation
    const [runnersToImport, setRunnersToImport] = React.useState<
        RunnerToImport[]
    >([]);

    const [isSaving, setIsSaving] = React.useState(false);

    const fileInputref = React.useRef<HTMLInputElement>(null);

    const csvHeader = React.useMemo<string[] | null>(() => {
        if (!csvData) {
            return null;
        }

        return csvData[0] ?? null;
    }, [csvData]);

    const csvBody = React.useMemo<string[][] | null>(() => {
        if (!csvData) {
            return null;
        }

        if (csvData.length < 2) {
            return [];
        }

        const [, ...body] = csvData;

        return body;
    }, [csvData]);

    const fetchRaces = React.useCallback(async () => {
        if (!accessToken) {
            return;
        }

        const result = await getAdminRaces(accessToken);

        if (!isApiRequestResultOk(result)) {
            ToastService.getToastr().error(
                "Impossible de récupérer la liste des courses",
            );
            return;
        }

        setRaces(getRaceDictFromRaces(result.json.races));
    }, [accessToken]);

    const fetchRunners = React.useCallback(async () => {
        if (!accessToken) {
            return;
        }

        const result = await getAdminRunners(accessToken);

        if (!isApiRequestResultOk(result)) {
            ToastService.getToastr().error(
                "Impossible de récupérer la liste des coureurs",
            );
            return;
        }

        setRunners(result.json.runners);
    }, [accessToken]);

    const raceOptions = React.useMemo<Array<SelectOption<number>>>(() => {
        if (!races) {
            return [];
        }

        return Object.values(races).map((race) => ({
            label: race.name,
            value: race.id,
        }));
    }, [races]);

    const existingRunnerIds = React.useMemo<Set<number>>(() => {
        if (!runners) {
            return new Set();
        }

        return new Set(runners.map((runner) => runner.id));
    }, [runners]);

    // Used to detect whether the same ID has been assigned to multiple runners to be imported
    const runnerToImportIdCounts = React.useMemo<Map<number, number>>(() => {
        const counts = new Map<number, number>();

        for (const { runner, toImport } of runnersToImport) {
            if (!toImport) {
                continue;
            }

            if (runner.id === undefined) {
                continue;
            }

            counts.set(runner.id, (counts.get(runner.id) ?? 0) + 1);
        }

        return counts;
    }, [runnersToImport]);

    const canImportRunners = React.useMemo<boolean>(() => {
        if (selectedRaceId === null) {
            return false;
        }

        const runners = runnersToImport.filter((runner) => runner.toImport);

        if (runners.length < 1) {
            return false;
        }

        // If all runners to import don't have different IDs
        if (
            Array.from(runnerToImportIdCounts.values()).some(
                (value) => value > 1,
            )
        ) {
            return false;
        }

        for (const { runner } of runners) {
            if (!hasRunnerFromCsvAllRequiredData(runner)) {
                return false;
            }

            if (existingRunnerIds.has(runner.id)) {
                return false;
            }
        }

        return true;
    }, [
        existingRunnerIds,
        runnerToImportIdCounts,
        runnersToImport,
        selectedRaceId,
    ]);

    React.useEffect(() => {
        void fetchRaces();
    }, [fetchRaces]);

    React.useEffect(() => {
        void fetchRunners();
    }, [fetchRunners]);

    // When CSV file content changes, reset mapping
    React.useEffect(() => {
        if (!csvHeader) {
            setRunnersCsvMapping({ ...DEFAULT_MAPPING });
            setIsMappingValidated(false);
            return;
        }

        setRunnersCsvMapping({
            [ImportCsvColumn.ID]: csvHeader.length > 0 ? 0 : null,
            [ImportCsvColumn.LASTNAME]: csvHeader.length > 1 ? 1 : null,
            [ImportCsvColumn.FIRSTNAME]: csvHeader.length > 2 ? 2 : null,
            [ImportCsvColumn.BIRTH_YEAR]: csvHeader.length > 3 ? 3 : null,
            [ImportCsvColumn.GENDER]: csvHeader.length > 4 ? 4 : null,
        });
    }, [csvHeader]);

    React.useEffect(() => {
        setRunnersToImport(
            runnersFromCsv.map((runner) => ({
                toImport:
                    runner.id !== undefined
                        ? !existingRunnerIds.has(runner.id)
                        : true,
                runner: structuredClone(runner),
            })),
        );
        // We want to run this effect only when runners from CSV changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runnersFromCsv]);

    const clearFileInput = React.useCallback(() => {
        if (fileInputref.current) {
            fileInputref.current.value = "";
        }

        setCsvData(null);
        setIsMappingValidated(false);
        setRunnersFromCsv([]);
        setRunnersToImport([]);
    }, []);

    function onSelectRace(e: React.ChangeEvent<HTMLSelectElement>): void {
        setSelectedRaceId(parseInt(e.target.value));
    }

    const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (
        e,
    ) => {
        void (async () => {
            const files = e.target.files;

            if (!files || files.length < 1) {
                setCsvData(null);
                return;
            }

            const file = files[0];

            const rows = (await parseCsv(file)).data;

            // Keep only lines having at least one non-empty value
            setCsvData(rows.filter((row) => row.some(Boolean)));
        })();
    };

    const onValidateMapping = (): void => {
        if (!csvBody) {
            return;
        }

        setIsMappingValidated(true);
        setRunnersFromCsv(
            csvBody.map((row) => getRunnerFromCsv(row, runnersCsvMapping)),
        );
    };

    const harmonizeNames = (): void => {
        setRunnersToImport((runners) =>
            runners.map(({ runner, ...params }) => ({
                ...params,
                runner: {
                    ...runner,
                    firstname: runner.firstname
                        ? harmonizeName(runner.firstname)
                        : "",
                    lastname: runner.lastname
                        ? harmonizeName(runner.lastname)
                        : "",
                },
            })),
        );
    };

    const updateRunner = <K extends keyof RunnerFromCsv>(
        index: number,
        key: K,
        value: RunnerFromCsv[K],
    ): void => {
        const runners = structuredClone(runnersToImport);

        const runnerToUpdate = runners[index];

        if (!runnerToUpdate) {
            return;
        }

        runnerToUpdate.runner[key] = value;

        setRunnersToImport(runners);
    };

    const toggleRunnerImport = (index: number): void => {
        const runners = structuredClone(runnersToImport);

        const runnerToUpdate = runners[index];

        if (!runnerToUpdate) {
            return;
        }

        runnerToUpdate.toImport = !runnerToUpdate.toImport;

        setRunnersToImport(runners);
    };

    const importRunners = React.useCallback(async () => {
        if (!accessToken || selectedRaceId === null) {
            return;
        }

        const runners = runnersToImport.filter(({ toImport }) => toImport);

        if (
            !runners.every(({ runner }) =>
                hasRunnerFromCsvAllRequiredData(runner),
            )
        ) {
            return;
        }

        const body: PostAdminRunnersBulkApiRequest["payload"] = (
            runners as Array<RunnerToImport<RunnerFromCsv>>
        ).map(({ runner }) => ({
            ...runner,
            birthYear: parseInt(runner.birthYear),
            stopped: false,
            raceId: selectedRaceId,
        }));

        const result = await postAdminRunnersBulk(accessToken, body);

        if (!isApiRequestResultOk(result)) {
            ToastService.getToastr().error("Une erreur est survenue");
            setIsSaving(false);
            return;
        }

        ToastService.getToastr().success(
            `${result.json.count} coureurs importés`,
        );
        clearFileInput();
        void fetchRunners();
    }, [
        accessToken,
        clearFileInput,
        fetchRunners,
        runnersToImport,
        selectedRaceId,
    ]);

    const runnersToImportCount = runnersToImport.filter(
        ({ toImport }) => toImport,
    ).length;
    const runnersFromCsvCount = runnersFromCsv.length;

    return (
        <Page id="admin-import-runners-csv" title="Import de coureurs">
            <Row>
                <Col>
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb url="/admin/runners" label="Coureurs" />
                        <Crumb label="Import via fichier CSV" />
                    </Breadcrumbs>
                </Col>
            </Row>

            <Row className="row-cols-auto">
                <Col>
                    <Input
                        label="Fichier CSV"
                        type="file"
                        onChange={onFileInputChange}
                        accept=".csv"
                        inputRef={fileInputref}
                    />
                </Col>
            </Row>

            {csvHeader && !isMappingValidated && (
                <Row className="mt-3">
                    <Col>
                        <div className="card">
                            <h2 className="mt-0">Mapping CSV</h2>

                            <CsvMapping
                                mapping={runnersCsvMapping}
                                setMapping={setRunnersCsvMapping}
                                csvColumns={csvHeader}
                                onValidateMapping={onValidateMapping}
                            />
                        </div>
                    </Col>
                </Row>
            )}

            {isMappingValidated && csvBody && (
                <>
                    <Row className="mt-3">
                        <Col>
                            <button
                                className="button"
                                onClick={() => {
                                    setIsMappingValidated(false);
                                }}
                            >
                                Modifier le mapping CSV
                            </button>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col>
                            <div className="card">
                                <Row>
                                    <Col>
                                        <h2 className="m-0">
                                            Import des coureurs
                                        </h2>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col>
                                        <h3 className="m-0">Course</h3>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col xl={3} lg={4} md={6} sm={12}>
                                        <Select
                                            label="Course"
                                            isLoading={races === false}
                                            options={raceOptions}
                                            value={selectedRaceId ?? undefined}
                                            onChange={onSelectRace}
                                        />
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col>
                                        <h3 className="m-0">
                                            Coureurs à importer
                                        </h3>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col>
                                        <div className="d-flex">
                                            <div className="flex-grow-1">
                                                <button
                                                    className="button"
                                                    onClick={harmonizeNames}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={
                                                            faWandMagicSparkles
                                                        }
                                                        className="me-2"
                                                    />
                                                    Harmoniser les noms
                                                </button>
                                            </div>
                                            <div>
                                                <button
                                                    className="button"
                                                    onClick={() => {
                                                        void importRunners();
                                                    }}
                                                    disabled={
                                                        !canImportRunners &&
                                                        !isSaving
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faFileArrowUp}
                                                        className="me-2"
                                                    />
                                                    Importer les coureurs
                                                </button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <p className="mb-0">
                                            {runnersToImportCount}/
                                            {runnersFromCsvCount} coureur
                                            {runnersToImportCount > 1
                                                ? "s"
                                                : ""}{" "}
                                            {runnersToImportCount > 1
                                                ? "seront importés"
                                                : "sera importé"}
                                        </p>
                                    </Col>
                                </Row>

                                {runnersToImport.map(
                                    ({ toImport, runner }, index) => {
                                        const runnerHasError = ((): boolean => {
                                            if (!toImport) {
                                                return false;
                                            }

                                            if (
                                                !hasRunnerFromCsvAllRequiredData(
                                                    runner,
                                                )
                                            ) {
                                                return true;
                                            }

                                            if (
                                                existingRunnerIds.has(runner.id)
                                            ) {
                                                return true;
                                            }

                                            return (
                                                (runnerToImportIdCounts.get(
                                                    runner.id,
                                                ) ?? 0) > 1
                                            );
                                        })();

                                        return (
                                            <Row
                                                key={index}
                                                className="py-1"
                                                style={{
                                                    background: runnerHasError
                                                        ? "rgba(255, 0, 0, 0.15)"
                                                        : undefined,
                                                }}
                                            >
                                                <Col>
                                                    <Row
                                                        className={clsx(
                                                            !toImport &&
                                                                "opacity-50",
                                                        )}
                                                    >
                                                        <Col className="flex-grow-0">
                                                            <Input
                                                                label="Dossard"
                                                                labelClassName="text-nowrap"
                                                                type="number"
                                                                min={0}
                                                                value={
                                                                    runner.id
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    updateRunner(
                                                                        index,
                                                                        "id",
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    );
                                                                }}
                                                            />
                                                        </Col>

                                                        <Col className="flex-grow-2">
                                                            <Input
                                                                label="Prénom"
                                                                labelClassName="text-nowrap"
                                                                value={
                                                                    runner.firstname
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    updateRunner(
                                                                        index,
                                                                        "firstname",
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                }}
                                                            />
                                                        </Col>

                                                        <Col className="flex-grow-2">
                                                            <Input
                                                                label="Nom de famille"
                                                                labelClassName="text-nowrap"
                                                                value={
                                                                    runner.lastname
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    updateRunner(
                                                                        index,
                                                                        "lastname",
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                }}
                                                            />
                                                        </Col>

                                                        <Col className="flex-grow-0">
                                                            <Input
                                                                label="Année de naissance"
                                                                labelClassName="text-nowrap"
                                                                value={
                                                                    runner.birthYear
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    updateRunner(
                                                                        index,
                                                                        "birthYear",
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                }}
                                                            />
                                                        </Col>

                                                        <Col>
                                                            <Select
                                                                label="Sexe"
                                                                options={
                                                                    GENDER_OPTIONS
                                                                }
                                                                value={
                                                                    runner.gender
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    updateRunner(
                                                                        index,
                                                                        "gender",
                                                                        e.target
                                                                            .value as Gender,
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                <Col className="flex-grow-0 d-flex align-items-end">
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className={clsx(
                                                                "button text-nowrap d-flex align-items-center",
                                                                !toImport &&
                                                                    "red",
                                                            )}
                                                            onClick={() => {
                                                                toggleRunnerImport(
                                                                    index,
                                                                );
                                                            }}
                                                        >
                                                            <span
                                                                className="d-inline-flex"
                                                                style={{
                                                                    width: "1.5em",
                                                                }}
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        toImport
                                                                            ? faCheck
                                                                            : faXmark
                                                                    }
                                                                />
                                                            </span>
                                                            Import
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        );
                                    },
                                )}
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </Page>
    );
}
