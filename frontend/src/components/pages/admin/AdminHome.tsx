import {Col, Row} from "react-bootstrap";
import Page from "../../layout/Page";
import MenuList from "../../pageParts/admin/home/MenuList";

export default function AdminHome() {
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
