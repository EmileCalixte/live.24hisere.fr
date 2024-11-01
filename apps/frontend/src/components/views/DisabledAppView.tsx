import React, { useContext } from "react";
import DOMPurify from "dompurify";
import { Col, Row } from "react-bootstrap";
import { appContext } from "../App";
import Page from "../ui/Page";

export default function DisabledAppView(): React.ReactElement {
  const {
    appData: { disabledAppMessage },
  } = useContext(appContext);

  const message = disabledAppMessage ?? "<p>Suivi live désactivé</p>";

  return (
    <Page id="disabled-app" title="Application désactivée">
      <Row>
        <Col>
          <div
            className="card mt-3"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(message),
            }}
          />
        </Col>
      </Row>
    </Page>
  );
}
