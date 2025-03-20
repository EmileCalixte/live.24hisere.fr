import React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetAdminPassageImportRules } from "../../../../hooks/api/requests/admin/passageImportRules/useGetAdminPassageImportRules";
import { useGetAdminRaces } from "../../../../hooks/api/requests/admin/races/useGetAdminRaces";
import { getPassageImportRulesBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { getRaceDictFromRaces } from "../../../../utils/raceUtils";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { Link } from "../../../ui/Link";
import Page from "../../../ui/Page";
import { PassageImportRuleCard } from "../../../viewParts/admin/passageImportRules/PassageImportRuleCard";

export default function PassageImportRulesAdminView(): React.ReactElement {
  const getRacesQuery = useGetAdminRaces();
  const races = getRacesQuery.data?.races;

  const getRulesQuery = useGetAdminPassageImportRules();
  const rules = getRulesQuery.data?.rules;

  const raceDict = React.useMemo(() => {
    if (!races) {
      return {};
    }

    return getRaceDictFromRaces(races);
  }, [races]);

  return (
    <Page
      id="admin-passage-import-rules"
      htmlTitle="Règles d'import de passages"
      title={
        <span className="flex flex-wrap items-center gap-5">
          Règles d'import de passages
          <span className="text-base">
            <Link variant="button" to="/admin/passage-import-rules/create" icon={<FontAwesomeIcon icon={faPlus} />}>
              Créer
            </Link>
          </span>
        </span>
      }
      breadCrumbs={getPassageImportRulesBreadcrumbs()}
    >
      <Card>
        {races === undefined || rules === undefined ? (
          <CircularLoader />
        ) : rules.length < 1 ? (
          <p>Aucune règle n'a été créée.</p>
        ) : (
          <div className="flex w-full flex-col gap-3 md:w-2/3 xl:w-1/3">
            {rules.map((rule) => (
              <Link
                key={rule.id}
                to={`/admin/passage-import-rules/${rule.id}`}
                className="text-inherit no-underline dark:text-inherit"
              >
                <PassageImportRuleCard rule={rule} races={rule.raceIds.map((raceId) => raceDict[raceId])} />
              </Link>
            ))}
          </div>
        )}
      </Card>
    </Page>
  );
}
