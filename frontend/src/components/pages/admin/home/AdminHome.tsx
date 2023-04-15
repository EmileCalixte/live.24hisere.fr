import {Col, Row} from "react-bootstrap";
import MenuList from "./MenuList";

export default function AdminHome() {
    return (
        <div id="page-admin-home">
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
        </div>
    );
}
