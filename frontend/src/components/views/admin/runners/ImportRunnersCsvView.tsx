import React from "react";
import { Col, Row } from "react-bootstrap";
import Breadcrumbs from "../../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../../ui/breadcrumbs/Crumb";
import Page from "../../../ui/Page";

export default function ImportRunnersCsvView(): React.ReactElement {
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
        </Page>
    );
}
