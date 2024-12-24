import React, { useCallback } from "react";
import { faFileCsv, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { AdminRunner, RunnerWithRaceCount } from "@live24hisere/core/types";
import { stringUtils } from "@live24hisere/utils";
import { getAdminRunners } from "../../../../services/api/runnerService";
import { getRunnersBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import CircularLoader from "../../../ui/CircularLoader";
import { Input } from "../../../ui/forms/Input";
import Page from "../../../ui/Page";
import RunnersTable from "../../../viewParts/admin/runners/RunnersTable";

export default function RunnersAdminView(): React.ReactElement {
  const { accessToken } = React.useContext(appContext).user;

  // false = not fetched yet
  const [runners, setRunners] = React.useState<Array<RunnerWithRaceCount<AdminRunner>> | false>(false);

  const [search, setSearch] = React.useState("");

  const fetchRunners = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminRunners(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des coureurs");
      return;
    }

    setRunners(result.json.runners);
  }, [accessToken]);

  React.useEffect(() => {
    void fetchRunners();
  }, [fetchRunners]);

  const displayedRunners = React.useMemo(() => {
    if (!runners) {
      return false;
    }

    const trimmedSearch = search.trim();

    if (trimmedSearch.length < 1) {
      return runners;
    }

    return runners.filter((runner) => {
      const firstnameMatches = stringUtils.normalizedIncludes(runner.firstname, trimmedSearch);
      const lastnameMatches = stringUtils.normalizedIncludes(runner.lastname, trimmedSearch);

      console.log(runner.firstname, runner.lastname, trimmedSearch);
      console.log(firstnameMatches, lastnameMatches);

      return firstnameMatches || lastnameMatches;
    });
  }, [runners, search]);

  return (
    <Page id="admin-runners" title="Coureurs">
      <Row>
        <Col>{getRunnersBreadcrumbs()}</Col>
      </Row>

      {displayedRunners === false && (
        <Row>
          <Col>
            <CircularLoader />
          </Col>
        </Row>
      )}

      {displayedRunners !== false && (
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
