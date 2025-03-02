import React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryState } from "nuqs";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { RunnerWithRaceCount } from "@live24hisere/core/types";
import { latinizedIncludes } from "../../../../../packages/utils/src/string-utils";
import { SearchParam } from "../../constants/searchParams";
import { useGetPublicRunners } from "../../hooks/api/requests/public/runners/useGetPublicRunners";
import { spaceshipRunnersByName } from "../../utils/runnerUtils";
import CircularLoader from "../ui/CircularLoader";
import { Button } from "../ui/forms/Button";
import { Input } from "../ui/forms/Input";
import Page from "../ui/Page";
import { FoundRunnerCard } from "../viewParts/runnerDetails/searchRunner/FoundRunnerCard";

export default function SearchRunnerView(): React.ReactElement {
  const getRunnersQuery = useGetPublicRunners();
  const runners = getRunnersQuery.data?.runners;

  const [querySearch, setQuerySearch] = useQueryState(SearchParam.SEARCH);
  const [search, setSearch] = React.useState(querySearch ?? "");
  const [matchingRunners, setMatchingRunners] = React.useState<RunnerWithRaceCount[] | undefined>(undefined);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
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
    <Page id="search-runners" title="Rechercher un coureur">
      <Row>
        <Col>
          <h1>Rechercher un coureur</h1>
        </Col>
      </Row>

      {runners === undefined ? (
        <CircularLoader />
      ) : (
        <Row>
          <Col xxl={4} xl={4} lg={6} md={8} sm={12}>
            <form className="d-flex flex-sm-row flex-column align-items-sm-end gap-2" onSubmit={onSubmit}>
              <Input
                className="flex-grow-1"
                label="Nom et/ou prénom"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                autoFocus={true}
                autoComplete="off"
              />

              <div className="d-flex">
                <Button className="flex-grow-1" type="submit" disabled={search.length < 1}>
                  <FontAwesomeIcon icon={faSearch} className="me-2" />
                  Rechercher
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      )}

      {matchingRunners !== undefined && (
        <Row>
          {matchingRunners.length < 1 && (
            <Col>
              <p>Aucun coureur trouvé. Essayez de modifier votre recherche.</p>
            </Col>
          )}

          {matchingRunners.length >= 1 && (
            <Col xxl={4} xl={4} lg={6} md={8} sm={12}>
              <ul className="d-flex flex-column gap-2">
                {matchingRunners.map((runner) => (
                  <li key={runner.id}>
                    <Link to={`/runner-details/${runner.id}`}>
                      <FoundRunnerCard runner={runner} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Col>
          )}
        </Row>
      )}
    </Page>
  );
}
