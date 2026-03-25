import React from "react";
import DOMPurify from "dompurify";
import { appDataContext } from "../../contexts/AppDataContext";
import { Card } from "./Card";

export default function GlobalInformationMessageCard(): React.ReactElement | null {
  const { globalInformationMessage } = React.useContext(appDataContext);

  if (!globalInformationMessage) {
    return null;
  }

  return (
    <Card
      id="global-information-message-banner"
      className="mx-3 mb-3 px-4 py-3 lg:mx-8 lg:mb-6"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(globalInformationMessage),
      }}
    />
  );
}
