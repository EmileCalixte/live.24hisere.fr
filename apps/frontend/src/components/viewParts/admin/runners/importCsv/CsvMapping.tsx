import React from "react";
import { Col, Row } from "react-bootstrap";
import { type ImportCsvColumn } from "../../../../../constants/importCsv";
import { type SelectOption } from "../../../../../types/Forms";
import { type RunnersCsvMapping } from "../../../../../types/ImportCsv";
import { type ReactStateSetter } from "../../../../../types/ReactUtils";
import { getObjectKeys } from "../../../../../utils/utils";
import Select from "../../../../ui/forms/Select";

interface CsvMappingProps {
    mapping: RunnersCsvMapping;
    setMapping: ReactStateSetter<RunnersCsvMapping>;
    csvColumns: string[];
    onValidateMapping: () => void;
}

export default function CsvMapping({
    mapping,
    setMapping,
    csvColumns,
    onValidateMapping,
}: CsvMappingProps): React.ReactElement {
    const csvColumnOptions: Array<SelectOption<number>> = csvColumns.map(
        (column, index) => ({
            label: column,
            value: index,
        }),
    );

    function updateMapping(key: ImportCsvColumn, index: number): void {
        const newMapping = { ...mapping };

        const existingKeyForIndex = getObjectKeys(newMapping).find(
            (key) => newMapping[key] === index,
        );

        if (existingKeyForIndex) {
            newMapping[existingKeyForIndex] = null;
        }

        newMapping[key] = index;

        setMapping(newMapping);
    }

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        onValidateMapping();
    };

    return (
        <Row>
            <Col xl={3} lg={4} md={6} sm={12}>
                <Row as="form" className="gap-2" onSubmit={onSubmit}>
                    {getObjectKeys(mapping).map((key) => (
                        <Col key={key} xs={12}>
                            <Select
                                label={key}
                                options={csvColumnOptions}
                                value={mapping[key] ?? undefined}
                                onChange={(e) => {
                                    updateMapping(
                                        key,
                                        parseInt(e.target.value),
                                    );
                                }}
                            />
                        </Col>
                    ))}

                    <Col xs={12} className="mt-3">
                        <button className="button" type="submit">
                            Valider le mapping
                        </button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
