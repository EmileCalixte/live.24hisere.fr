import React from "react";
import { faFileCsv, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { stringUtils } from "@live24hisere/utils";
import { useGetAdminRunners } from "../../../../hooks/api/requests/admin/runners/useGetAdminRunners";
import { useNameSortedRunners } from "../../../../hooks/runners/useNameSortedRunners";
import { getRunnersBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import CircularLoader from "../../../ui/CircularLoader";
import { Input } from "../../../ui/forms/Input";
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
    <Page id="admin-runners" title="Coureurs">
      <Row>
        <Col>{getRunnersBreadcrumbs()}</Col>
      </Row>

      {!displayedRunners && (
        <Row>
          <Col>
            <CircularLoader />
          </Col>
        </Row>
      )}

      {displayedRunners && (
        <>
          <Row>
            <Col className="d-flex gap-2">
              <Link to="/admin/runners/create" className="button">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Ajouter un coureur
              </Link>

              <Link to="/admin/runners/import-csv" className="button">
                <FontAwesomeIcon icon={faFileCsv} className="me-2" />
                Importer via fichier CSV
              </Link>
            </Col>
          </Row>

          <Row>
            <Col lg={3} md={4} sm={6} xs={12} className="mt-3">
              <Input
                label="Rechercher"
                placeholder="Nom ou prénom"
                autoComplete="off"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </Col>
          </Row>

          <Row>
            <Col className="mt-3">
              {displayedRunners.length === 0 && <p>Aucun coureur</p>}

              {displayedRunners.length > 0 && <RunnersTable runners={displayedRunners} />}
            </Col>
          </Row>
        </>
      )}
    </Page>
  );
}
