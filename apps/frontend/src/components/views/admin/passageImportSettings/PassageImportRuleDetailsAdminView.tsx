import React from "react";
import { Navigate } from "react-router-dom";
import { useGetAdminPassageImportRule } from "../../../../hooks/api/requests/admin/passageImportRules/useGetAdminPassageImportRule";
import { useRequiredParams } from "../../../../hooks/useRequiredParams";
import { getEditPassageImportRuleBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { is404Error } from "../../../../utils/apiUtils";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import PassageImportRuleDetailsForm from "../../../viewParts/admin/passageImportRules/PassageImportRuleDetailsForm";

export default function PassageImportRuleDetailsAdminView(): React.ReactElement {
  const { ruleId } = useRequiredParams(["ruleId"]);

  const getRuleQuery = useGetAdminPassageImportRule(ruleId);
  const rule = getRuleQuery.data?.rule;
  const isRuleNotFound = is404Error(getRuleQuery.error);

  const [url, setUrl] = React.useState("");
  const [isActive, setIsActive] = React.useState(false);

  // const unsavedChanges = React.useMemo(() => {
  //   if (!rule) {
  //     return false;
  //   }

  //   return [url === rule.url, isActive === rule.isActive].includes(false);
  // }, [rule, url, isActive]);

  React.useEffect(() => {
    if (!rule) {
      return;
    }

    setUrl(rule.url);
    setIsActive(rule.isActive);
  }, [rule]);

  if (isRuleNotFound) {
    return <Navigate to="/admin/passage-import-rules" />;
  }

  return (
    <Page
      id="admin-passage-import-rule-details"
      htmlTitle="Détails de la règle d'import de passages"
      title="Détails de la règle d'import de passages"
      breadCrumbs={getEditPassageImportRuleBreadcrumbs()}
    >
      {rule === undefined ? (
        <CircularLoader />
      ) : (
        <Card className="flex flex-col gap-3">
          <h2>Détails de la règle</h2>

          <div className="w-full md:w-1/2 xl:w-1/4">
            <PassageImportRuleDetailsForm
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onSubmit={(e) => {}}
              url={url}
              setUrl={setUrl}
              isActive={isActive}
              setIsActive={setIsActive}
              submitButtonDisabled={false}
            />
          </div>
        </Card>
      )}
    </Page>
  );
}
