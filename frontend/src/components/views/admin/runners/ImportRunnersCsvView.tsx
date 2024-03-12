import React from "react";
import { Col, Row } from "react-bootstrap";
import { ImportCsvColumn } from "../../../../constants/importCsv";
import { type RunnersCsvMapping } from "../../../../types/ImportCsv";
import { parseCsv } from "../../../../utils/csvUtils";
import Breadcrumbs from "../../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../../ui/breadcrumbs/Crumb";
import { Input } from "../../../ui/forms/Input";
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
                                        onValidateMapping={() => { setIsMappingValidated(true); }}
                            />
                        </div>
                    </Col>
                </Row>
            )}

            {isMappingValidated && (
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
                                            onClick={() => { setIsMappingValidated(false); }}
                                    >
                                        Modifier le mapping
                                    </button>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    TODO
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            )}
        </Page>
    );
}
