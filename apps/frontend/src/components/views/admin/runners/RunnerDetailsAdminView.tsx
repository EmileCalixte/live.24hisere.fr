import React from "react";
import { Col, Row } from "react-bootstrap";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { GENDER } from "@live24hisere/core/constants";
import type {
  AdminEditionWithRaceCount,
  AdminRaceWithRunnerCount,
  AdminRunner,
  Gender,
  Participant,
  RunnerWithRaceCount,
} from "@live24hisere/core/types";
import { getAdminEditions } from "../../../../services/api/editionService";
import { getAdminRunnerParticipations } from "../../../../services/api/participantService";
import { getAdminRaces } from "../../../../services/api/raceService";
import { deleteAdminRunner, getAdminRunner, patchAdminRunner } from "../../../../services/api/runnerService";
import { getRunnerDetailsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import RunnerDetailsForm from "../../../viewParts/admin/runners/RunnerDetailsForm";
import RunnerParticipationsTable from "../../../viewParts/admin/runners/RunnerParticipationsTable";

export default function RunnerDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const { runnerId: urlRunnerId } = useParams();

  const [editions, setEditions] = React.useState<AdminEditionWithRaceCount[] | undefined | null>(undefined);

  const [races, setRaces] = React.useState<AdminRaceWithRunnerCount[] | undefined | null>(undefined);
  console.log(races);

  const [runner, setRunner] = React.useState<RunnerWithRaceCount<AdminRunner> | undefined | null>(undefined);

  const [participations, setParticipations] = React.useState<Participant[] | undefined | null>(undefined);

  const [runnerFirstname, setRunnerFirstname] = React.useState("");
  const [runnerLastname, setRunnerLastname] = React.useState("");
  const [runnerGender, setRunnerGender] = React.useState<Gender>(GENDER.M);
  const [runnerBirthYear, setRunnerBirthYear] = React.useState("0");
  const [runnerIsPublic, setRunnerIsPublic] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);

  const unsavedChanges = React.useMemo(() => {
    if (!runner) {
      return false;
    }

    return [
      runnerFirstname === runner.firstname,
      runnerLastname === runner.lastname,
      runnerGender === runner.gender,
      runnerBirthYear === runner.birthYear,
      runnerIsPublic === runner.isPublic,
    ].includes(false);
  }, [runner, runnerFirstname, runnerLastname, runnerGender, runnerBirthYear, runnerIsPublic]);

  const fetchEditions = React.useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminEditions(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des éditions");
      return;
    }

    setEditions(result.json.editions);
  }, [accessToken]);

  const fetchRaces = React.useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminRaces(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des courses");
      return;
    }

    setRaces(result.json.races);
  }, [accessToken]);

  const fetchRunner = React.useCallback(async () => {
    if (!urlRunnerId || !accessToken) {
      return;
    }

    const result = await getAdminRunner(accessToken, urlRunnerId);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer les détails du coureur");
      setRunner(null);
      return;
    }

    const runner = result.json.runner;

    setRunner(runner);

    setRunnerFirstname(runner.firstname);
    setRunnerLastname(runner.lastname);
    setRunnerGender(runner.gender);
    setRunnerBirthYear(runner.birthYear);
    setRunnerIsPublic(runner.isPublic);
  }, [accessToken, urlRunnerId]);

  const fetchParticipations = React.useCallback(async () => {
    if (!urlRunnerId || !accessToken) {
      return;
    }

    const result = await getAdminRunnerParticipations(accessToken, urlRunnerId);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer les participations du coureur");
      return;
    }

    setParticipations(result.json.participations);
  }, [accessToken, urlRunnerId]);

  React.useEffect(() => {
    void fetchEditions();
  }, [fetchEditions]);

  React.useEffect(() => {
    void fetchRaces();
  }, [fetchRaces]);

  React.useEffect(() => {
    void fetchRunner();
  }, [fetchRunner]);

  React.useEffect(() => {
    void fetchParticipations();
  }, [fetchParticipations]);

  const onSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!runner || !accessToken) {
        return;
      }

      setIsSaving(true);

      const body = {
        firstname: runnerFirstname,
        lastname: runnerLastname,
        birthYear: parseInt(runnerBirthYear),
        gender: runnerGender,
        isPublic: runnerIsPublic,
      };

      const result = await patchAdminRunner(accessToken, runner.id, body);

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        setIsSaving(false);
        return;
      }

      ToastService.getToastr().success("Détails du coureur enregistrés");

      setIsSaving(false);

      setRunner(result.json.runner);
    },
    [runner, accessToken, runnerFirstname, runnerLastname, runnerBirthYear, runnerGender, runnerIsPublic],
  );

  const deleteRunner = React.useCallback(async () => {
    if (!runner || !accessToken) {
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce coureur ?")) {
      return;
    }

    const result = await deleteAdminRunner(accessToken, runner.id);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Une erreur est survenue");
      return;
    }

    ToastService.getToastr().success("Coureur supprimé");
    navigate("/admin/runners");
  }, [accessToken, navigate, runner]);

  if (runner === null) {
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
                onSubmit={(e) => {
                  void onSubmit(e);
                }}
                firstname={runnerFirstname}
                setFirstname={setRunnerFirstname}
                lastname={runnerLastname}
                setLastname={setRunnerLastname}
                gender={runnerGender}
                setGender={setRunnerGender}
                birthYear={runnerBirthYear}
                setBirthYear={setRunnerBirthYear}
                isPublic={runnerIsPublic}
                setIsPublic={setRunnerIsPublic}
                submitButtonDisabled={isSaving || !unsavedChanges}
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
                  editions={editions ?? undefined}
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

              <button
                className="button red"
                onClick={() => {
                  void deleteRunner();
                }}
              >
                Supprimer le coureur
              </button>
            </Col>
          </Row>
        </>
      )}
    </Page>
  );
}
