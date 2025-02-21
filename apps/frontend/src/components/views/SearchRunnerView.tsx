import { Col, Row } from "react-bootstrap";
import Page from "../ui/Page";

export default function SearchRunnerView(): React.ReactElement {
  return (
    <Page id="search-runners" title="Rechercher un coureur">
      <Row>
        <Col>
          <h1>Rechercher un coureur</h1>
        </Col>
      </Row>
    </Page>
  );
}
