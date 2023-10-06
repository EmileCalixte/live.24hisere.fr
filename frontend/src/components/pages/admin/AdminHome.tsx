import React from "react";
import { Col, Row } from "react-bootstrap";
import Page from "../../ui/Page";
import MenuList from "../../pageParts/admin/home/MenuList";

export default function AdminHome(): React.ReactElement {
    return (
        <Page id="admin-home" title="Administration">
            <Row>
                <Col>
                    <h1>Administration</h1>
                </Col>
            </Row>

            <Row>
                <Col>
                    <MenuList />
                </Col>
            </Row>
        </Page>
    );
}
