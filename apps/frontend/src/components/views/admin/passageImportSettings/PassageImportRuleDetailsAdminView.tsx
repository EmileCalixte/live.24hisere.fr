import type React from "react";
import { useRequiredParams } from "../../../../hooks/useRequiredParams";
import { Card } from "../../../ui/Card";
import Page from "../../../ui/Page";

export default function PassageImportRuleDetailsAdminView(): React.ReactElement {
  const { ruleId } = useRequiredParams(["ruleId"]);

  return (
    <Page
      id="admin-passage-import-rule-details"
      htmlTitle="Détails de la règle d'import de passages"
      title="Détails de la règle d'import de passages"
    >
      <Card>TODO {ruleId}</Card>
    </Page>
  );
}
