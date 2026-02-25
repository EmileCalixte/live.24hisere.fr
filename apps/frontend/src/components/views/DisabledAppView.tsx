import React from "react";
import DOMPurify from "dompurify";
import { appDataContext } from "../../contexts/AppDataContext";
import { Card } from "../ui/Card";
import Page from "../ui/Page";

export default function DisabledAppView(): React.ReactElement {
  const { disabledAppMessage } = React.useContext(appDataContext);

  const message = disabledAppMessage ?? "<p>Suivi live désactivé</p>";

  return (
    <Page id="disabled-app" title="Application désactivée" titleSrOnly htmlTitle="Application désactivée">
      <Card className="mt-3">
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(message),
          }}
        />
      </Card>
    </Page>
  );
}
