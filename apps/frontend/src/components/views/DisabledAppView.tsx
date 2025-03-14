import React from "react";
import DOMPurify from "dompurify";
import { appContext } from "../../contexts/AppContext";
import { Card } from "../ui/Card";
import Page from "../ui/Page";

export default function DisabledAppView(): React.ReactElement {
  const {
    appData: { disabledAppMessage },
  } = React.useContext(appContext);

  const message = disabledAppMessage ?? "<p>Suivi live désactivé</p>";

  return (
    <Page id="disabled-app" htmlTitle="Application désactivée">
      <Card
        className="mt-3"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(message),
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(message),
          }}
        />
      </Card>
    </Page>
  );
}
