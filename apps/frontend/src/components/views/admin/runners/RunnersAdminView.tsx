import React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { stringUtils } from "@live24hisere/utils";
import { useGetAdminRunners } from "../../../../hooks/api/requests/admin/runners/useGetAdminRunners";
import { useNameSortedRunners } from "../../../../hooks/runners/useNameSortedRunners";
import { getRunnersBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { Input } from "../../../ui/forms/Input";
import { Link } from "../../../ui/Link";
import Page from "../../../ui/Page";
import RunnersTable from "../../../viewParts/admin/runners/RunnersTable";

export default function RunnersAdminView(): React.ReactElement {
  const getRunnersQuery = useGetAdminRunners();
  const runners = getRunnersQuery.data?.runners;

  const [search, setSearch] = React.useState("");

  const sortedRunners = useNameSortedRunners(runners);

  const displayedRunners = React.useMemo(() => {
    if (!sortedRunners) {
      return undefined;
    }

    const trimmedSearch = search.trim();

    if (trimmedSearch.length < 1) {
      return sortedRunners;
    }

    return sortedRunners.filter((runner) => {
      const firstnameMatches = stringUtils.latinizedIncludes(runner.firstname, trimmedSearch);
      const lastnameMatches = stringUtils.latinizedIncludes(runner.lastname, trimmedSearch);

      return firstnameMatches || lastnameMatches;
    });
  }, [sortedRunners, search]);

  return (
    <Page
      id="admin-runners"
      htmlTitle="Coureurs"
      title={
        <span className="flex flex-wrap items-center gap-5">
          Coureurs
          <> </>
          <span className="text-base">
            <Link variant="button" to="/admin/runners/create" icon={<FontAwesomeIcon icon={faPlus} />}>
              Créer
            </Link>
          </span>
        </span>
      }
      breadCrumbs={getRunnersBreadcrumbs()}
    >
      {!displayedRunners ? (
        <CircularLoader />
      ) : (
        <Card className="flex flex-col gap-3">
          <div className="w-full md:w-1/2 xl:w-1/4">
            <Input
              label="Rechercher"
              placeholder="Nom ou prénom"
              autoComplete="off"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>

          <div>
            {displayedRunners.length === 0 && <p>Aucun coureur</p>}

            {displayedRunners.length > 0 && <RunnersTable runners={displayedRunners} />}
          </div>
        </Card>
      )}
    </Page>
  );
}
