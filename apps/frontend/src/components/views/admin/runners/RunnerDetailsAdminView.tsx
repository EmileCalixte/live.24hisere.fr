import React from "react";
import { Col, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { GENDER } from "@live24hisere/core/constants";
import type { Gender } from "@live24hisere/core/types";
import { COUNTRY_NULL_OPTION_VALUE } from "../../../../constants/forms";
import { useGetAdminEditions } from "../../../../hooks/api/requests/admin/editions/useGetAdminEditions";
import { useGetAdminRunnerParticipations } from "../../../../hooks/api/requests/admin/participants/useGetAdminRunnerParticipations";
import { useGetAdminRaces } from "../../../../hooks/api/requests/admin/races/useGetAdminRaces";
import { useDeleteAdminRunner } from "../../../../hooks/api/requests/admin/runners/useDeleteAdminRunner";
import { useGetAdminRunner } from "../../../../hooks/api/requests/admin/runners/useGetAdminRunner";
import { usePatchAdminRunner } from "../../../../hooks/api/requests/admin/runners/usePatchAdminRunner";
import { useRequiredParams } from "../../../../hooks/useRequiredParams";
import { getRunnerDetailsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { is404Error } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import RunnerDetailsForm from "../../../viewParts/admin/runners/RunnerDetailsForm";
import RunnerParticipationsTable from "../../../viewParts/admin/runners/RunnerParticipationsTable";

export default function RunnerDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const { runnerId: urlRunnerId } = useRequiredParams(["runnerId"]);

  const getRunnerQuery = useGetAdminRunner(urlRunnerId);
  const runner = getRunnerQuery.data?.runner;
  const isRunnerNotFound = is404Error(getRunnerQuery.error);

  const getParticipationsQuery = useGetAdminRunnerParticipations(runner?.id);
  const participations = getParticipationsQuery.data?.participations;

  const patchRunnerMutation = usePatchAdminRunner(runner?.id);
  const deleteRunnerMutation = useDeleteAdminRunner(runner?.id);

  const getEditionsQuery = useGetAdminEditions();
  const editions = getEditionsQuery.data?.editions;

  const getRacesQuery = useGetAdminRaces();
  const races = getRacesQuery.data?.races;

  const [runnerFirstname, setRunnerFirstname] = React.useState("");
  const [runnerLastname, setRunnerLastname] = React.useState("");
  const [runnerGender, setRunnerGender] = React.useState<Gender>(GENDER.M);
  const [runnerBirthYear, setRunnerBirthYear] = React.useState("0");
  const [runnerCountryCode, setRunnerCountryCode] = React.useState<string | null>(null);
  const [runnerIsPublic, setRunnerIsPublic] = React.useState(false);

  const unsavedChanges = React.useMemo(() => {
    if (!runner) {
      return false;
    }

    return [
      runnerFirstname === runner.firstname,
      runnerLastname === runner.lastname,
      runnerGender === runner.gender,
      runnerBirthYear === runner.birthYear,
      runnerCountryCode === runner.countryCode,
      runnerIsPublic === runner.isPublic,
    ].includes(false);
  }, [runner, runnerFirstname, runnerLastname, runnerGender, runnerBirthYear, runnerCountryCode, runnerIsPublic]);

  React.useEffect(() => {
    if (!runner) {
      return;
    }

    setRunnerFirstname(runner.firstname);
    setRunnerLastname(runner.lastname);
    setRunnerGender(runner.gender);
    setRunnerBirthYear(runner.birthYear);
    setRunnerCountryCode(runner.countryCode);
    setRunnerIsPublic(runner.isPublic);
  }, [runner]);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    if (!runner || !accessToken) {
      return;
    }

    const body = {
      firstname: runnerFirstname,
      lastname: runnerLastname,
      birthYear: parseInt(runnerBirthYear),
      countryCode: runnerCountryCode === COUNTRY_NULL_OPTION_VALUE ? null : runnerCountryCode,
      gender: runnerGender,
      isPublic: runnerIsPublic,
    };

    patchRunnerMutation.mutate(body, {
      onSuccess: () => {
        void getRunnerQuery.refetch();
      },
    });
  };

  function deleteRunner(): void {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce coureur ?")) {
      return;
    }

    deleteRunnerMutation.mutate(undefined, {
      onSuccess: () => {
        void navigate("/admin/runners");
      },
    });
  }

  if (isRunnerNotFound) {
    return <Navigate to="/admin/runners" />;
  }

  return (
    <Page
      id="admin-runner-details"
      title={runner === undefined ? "Chargement" : `Détails du coureur ${runner.firstname} ${runner.lastname}`}
      className="d-flex flex-column gap-3"
    >
      <Row>
        <Col>{getRunnerDetailsBreadcrumbs(runner)}</Col>
      </Row>

      {runner === undefined && (
        <Row>
          <Col>
            <CircularLoader />
          </Col>
        </Row>
      )}

      {runner !== undefined && (
        <>
          <Row>
            <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
              <h3>Détails du coureur</h3>

              <RunnerDetailsForm
                onSubmit={onSubmit}
                firstname={runnerFirstname}
                setFirstname={setRunnerFirstname}
                lastname={runnerLastname}
                setLastname={setRunnerLastname}
                gender={runnerGender}
                setGender={setRunnerGender}
                birthYear={runnerBirthYear}
                setBirthYear={setRunnerBirthYear}
                countryCode={runnerCountryCode}
                setCountryCode={setRunnerCountryCode}
                isPublic={runnerIsPublic}
                setIsPublic={setRunnerIsPublic}
                submitButtonDisabled={patchRunnerMutation.isPending || !unsavedChanges}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <h3>Participations</h3>

              {participations === undefined && <CircularLoader />}

              {participations && participations.length <= 0 && (
                <p>Ce coureur n'est enregistré comme participant sur aucune course.</p>
              )}

              {participations && participations.length > 0 && (
                <RunnerParticipationsTable
                  participations={participations}
                  races={races ?? undefined}
                  editions={editions}
                />
              )}
            </Col>
          </Row>

          <Row>
            <Col>
              <h3>Supprimer le coureur</h3>

              <p>
                Toutes les participations et tous les passages liés à ce coureur seront également supprimés. Cette
                action est irréversible.
              </p>

              <button className="button red" onClick={deleteRunner}>
                Supprimer le coureur
              </button>
            </Col>
          </Row>
        </>
      )}
    </Page>
  );
}
