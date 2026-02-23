import React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryState } from "nuqs";
import type { RunnerWithRaceCount } from "@live24hisere/core/types";
import { latinizedIncludes } from "../../../../../packages/utils/src/string-utils";
import { SearchParam } from "../../constants/searchParams";
import { useGetPublicRunners } from "../../hooks/api/requests/public/runners/useGetPublicRunners";
import type { FormSubmitEventHandler } from "../../types/utils/react";
import { spaceshipRunnersByName } from "../../utils/runnerUtils";
import CircularLoader from "../ui/CircularLoader";
import { Button } from "../ui/forms/Button";
import { Input } from "../ui/forms/Input";
import { Link } from "../ui/Link";
import Page from "../ui/Page";
import { FoundRunnerCard } from "../viewParts/runnerDetails/searchRunner/FoundRunnerCard";

export default function SearchRunnerView(): React.ReactElement {
  const getRunnersQuery = useGetPublicRunners();
  const runners = getRunnersQuery.data?.runners;

  const [querySearch, setQuerySearch] = useQueryState(SearchParam.SEARCH);
  const [search, setSearch] = React.useState(querySearch ?? "");
  const [matchingRunners, setMatchingRunners] = React.useState<RunnerWithRaceCount[] | undefined>(undefined);

  const onSubmit: FormSubmitEventHandler = (e) => {
    e.preventDefault();

    void setQuerySearch(search.trim());
  };

  React.useEffect(() => {
    if (!runners || !querySearch) {
      return;
    }

    setMatchingRunners(
      runners
        .filter(
          (runner) =>
            latinizedIncludes(runner.firstname, querySearch)
            || latinizedIncludes(runner.lastname, querySearch)
            || latinizedIncludes(`${runner.firstname} ${runner.lastname}`, querySearch)
            || latinizedIncludes(`${runner.lastname} ${runner.firstname}`, querySearch),
        )
        .sort(spaceshipRunnersByName),
    );
  }, [querySearch, runners]);

  return (
    <Page id="search-runners" htmlTitle="Rechercher un coureur" title="Rechercher un coureur" layout="flexGap">
      {runners === undefined ? (
        <CircularLoader />
      ) : (
        <form
          className="flex w-full flex-col gap-2 sm:flex-row sm:items-end md:w-3/4 xl:w-1/2 2xl:w-1/3"
          onSubmit={onSubmit}
        >
          <Input
            className="grow"
            label="Nom et/ou prénom"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            autoFocus={true}
            autoComplete="off"
          />

          <div className="flex">
            <Button className="grow-1" type="submit" disabled={search.length < 1}>
              <FontAwesomeIcon icon={faSearch} className="me-2" />
              Rechercher
            </Button>
          </div>
        </form>
      )}

      {matchingRunners !== undefined && (
        <>
          {matchingRunners.length < 1 && <p>Aucun coureur trouvé. Essayez de modifier votre recherche.</p>}

          {matchingRunners.length >= 1 && (
            <ul className="flex w-full flex-col gap-2 md:w-3/4 xl:w-1/2 2xl:w-1/3">
              {matchingRunners.map((runner) => (
                <li key={runner.id}>
                  <Link to={`/runner-details/${runner.id}`} className="text-inherit no-underline dark:text-inherit">
                    <FoundRunnerCard runner={runner} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Page>
  );
}
