import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { GENDER_OPTIONS } from "../../../../constants/forms";
import { type Gender } from "../../../../constants/gender";
import { ImportCsvColumn } from "../../../../constants/importCsv";
import { type RunnerFromCsv, type RunnersCsvMapping } from "../../../../types/ImportCsv";
import { getRunnerFromCsv, parseCsv } from "../../../../utils/csvUtils";
import { harmonizeName } from "../../../../utils/stringUtils";
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

export default function ImportRunnersCsvView(): React.ReactElement {
    const [csvData, setCsvData] = React.useState<string[][] | null>(null);
    const [runnersCsvMapping, setRunnersCsvMapping] = React.useState<RunnersCsvMapping>({ ...DEFAULT_MAPPING });
    const [isMappingValidated, setIsMappingValidated] = React.useState(false);

    const [runnersToImport, setRunnersToImport] = React.useState<Array<Partial<RunnerFromCsv>>>([]);

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

    const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        void (async () => {
            const files = e.target.files;

            if (!files || files.length < 1) {
                setCsvData(null);
                return;
            }

            const file = files[0];

            setCsvData((await parseCsv(file)).data);
        })();
    };

    const onValidateMapping = (): void => {
        if (!csvBody) {
            return;
        }

        setIsMappingValidated(true);
        setRunnersToImport(csvBody.map(row => getRunnerFromCsv(row, runnersCsvMapping)));
    };

    const harmonizeNames = (): void => {
        setRunnersToImport(runners => runners.map(runner => ({
            ...runner,
            firstname: runner.firstname ? harmonizeName(runner.firstname) : undefined,
            lastname: runner.lastname ? harmonizeName(runner.lastname) : undefined,
        })));
    };

    const updateRunner = <K extends keyof RunnerFromCsv>(index: number, key: K, value: RunnerFromCsv[K]): void => {
        const runners = structuredClone(runnersToImport);

        const runnerToUpdate = runners[index];

        if (!runnerToUpdate) {
            return;
        }

        runnerToUpdate[key] = value;

        setRunnersToImport(runners);
    };

    const runnersToImportCount = runnersToImport.length;

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
                    <Input label="Fichier CSV"
                           type="file"
                           onChange={onFileInputChange}
                           accept=".csv"
                    />
                </Col>
            </Row>

            {csvHeader && !isMappingValidated && (
                <Row className="mt-3">
                    <Col>
                        <div className="card">
                            <h2 className="mt-0">Mapping CSV</h2>

                            <CsvMapping mapping={runnersCsvMapping}
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
                            <button className="button"
                                    onClick={() => { setIsMappingValidated(false); }}
                            >
                                Modifier le mapping
                            </button>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col>
                            <div className="card">
                                <Row>
                                    <Col>
                                        <h2 className="mt-0">Import des coureurs</h2>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <button className="button"
                                                onClick={harmonizeNames}
                                        >
                                            <FontAwesomeIcon icon={faWandMagicSparkles} className="me-2" />
                                            Harmoniser les noms
                                        </button>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <p className="mb-0">{runnersToImportCount} coureur{runnersToImportCount > 1 ? "s" : ""} {runnersToImportCount > 1 ? "seront importés" : "sera importé"}</p>
                                    </Col>
                                </Row>

                                {runnersToImport.map((runner, index) => (
                                    <Row key={index} className="mt-2">
                                        <Col className="flex-grow-0">
                                            <Input label="Dossard"
                                                   labelClassName="text-nowrap"
                                                   type="number"
                                                   value={runner.id}
                                                   onChange={(e) => { updateRunner(index, "id", parseInt(e.target.value)); }}
                                            />
                                        </Col>

                                        <Col className="flex-grow-2">
                                            <Input label="Prénom"
                                                   labelClassName="text-nowrap"
                                                   value={runner.firstname}
                                                   onChange={(e) => { updateRunner(index, "firstname", e.target.value); }}
                                            />
                                        </Col>

                                        <Col className="flex-grow-2">
                                            <Input label="Nom de famille"
                                                   labelClassName="text-nowrap"
                                                   value={runner.lastname}
                                                   onChange={(e) => { updateRunner(index, "lastname", e.target.value); }}
                                            />
                                        </Col>

                                        <Col className="flex-grow-0">
                                            <Input label="Année de naissance"
                                                   labelClassName="text-nowrap"
                                                   value={runner.birthYear}
                                                   onChange={(e) => { updateRunner(index, "birthYear", e.target.value); }}
                                            />
                                        </Col>

                                        <Col>
                                            <Select label="Sexe"
                                                    options={GENDER_OPTIONS}
                                                    value={runner.gender}
                                                    onChange={(e) => { updateRunner(index, "gender", e.target.value as Gender); }}
                                            />
                                        </Col>

                                        <Col className="flex-grow-0">
                                            TODO
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </Page>
    );
}
