import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { GENDER } from "@live24hisere/core/constants";
import {
  type AdminProcessedPassage,
  type AdminRaceWithRunnerCount,
  type Gender,
  type RunnerWithProcessedPassages,
  type RunnerWithRace,
} from "@live24hisere/core/types";
import { getAdminRaces } from "../../../../services/api/raceService";
import {
  deleteAdminRunner,
  deleteAdminRunnerPassage,
  getAdminRunner,
  patchAdminRunner,
  patchAdminRunnerPassage,
  postAdminRunnerPassage,
} from "../../../../services/api/runnerService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { getProcessedPassagesFromPassages } from "../../../../utils/passageUtils";
import { formatDateAsString, formatDateForApi } from "../../../../utils/utils";
import { appContext } from "../../../App";
import Breadcrumbs from "../../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../../ui/breadcrumbs/Crumb";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import RunnerDetailsForm from "../../../viewParts/admin/runners/RunnerDetailsForm";
import RunnerDetailsPassages from "../../../viewParts/admin/runners/RunnerDetailsPassages";

export default function RunnerDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = useContext(appContext).user;

  const { runnerId: urlRunnerId } = useParams();

  const [races, setRaces] = useState<AdminRaceWithRunnerCount[] | false>(false);

  const [runner, setRunner] = useState<
    RunnerWithProcessedPassages<RunnerWithRace, AdminProcessedPassage> | undefined | null
  >(undefined);

  const [runnerId, setRunnerId] = useState(0);
  const [runnerFirstname, setRunnerFirstname] = useState("");
  const [runnerLastname, setRunnerLastname] = useState("");
  const [runnerGender, setRunnerGender] = useState<Gender>(GENDER.M);
  const [runnerBirthYear, setRunnerBirthYear] = useState("0");
  const [runnerStopped, setRunnerStopped] = useState(false);
  const [runnerRaceId, setRunnerRaceId] = useState(0);

  const [isSaving, setIsSaving] = useState(false);

  const runnerRace = useMemo<AdminRaceWithRunnerCount | null>(() => {
    if (!runner || !races) {
      return null;
    }

    const race = races.find((race) => race.id === runner.raceId);

    if (!race) {
      return null;
    }

    return race;
  }, [runner, races]);

  const unsavedChanges = useMemo(() => {
    if (!runner) {
      return false;
    }

    return [
      runnerId === runner.id,
      runnerFirstname === runner.firstname,
      runnerLastname === runner.lastname,
      runnerGender === runner.gender,
      runnerBirthYear === runner.birthYear,
      runnerStopped === runner.stopped,
      runnerRaceId === runner.raceId,
    ].includes(false);
  }, [runner, runnerId, runnerFirstname, runnerLastname, runnerGender, runnerBirthYear, runnerStopped, runnerRaceId]);

  const fetchRaces = useCallback(async () => {
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

  const fetchRunner = useCallback(async () => {
    if (!races || !urlRunnerId || !accessToken) {
      return;
    }

    const result = await getAdminRunner(accessToken, urlRunnerId);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer les détails du coureur");
      setRunner(null);
      return;
    }

    const runner = result.json.runner;

    const race = races.find((race) => race.id === runner.raceId);

    if (!race) {
      throw new Error("Runner race not found");
    }

    setRunner({
      ...runner,
      race,
      passages: getProcessedPassagesFromPassages(race, runner.passages),
    });

    setRunnerId(runner.id);
    setRunnerFirstname(runner.firstname);
    setRunnerLastname(runner.lastname);
    setRunnerGender(runner.gender);
    setRunnerBirthYear(runner.birthYear);
    setRunnerStopped(runner.stopped);
    setRunnerRaceId(runner.raceId);
  }, [accessToken, urlRunnerId, races]);

  const updatePassageVisiblity = useCallback(
    async (passage: AdminProcessedPassage, hidden: boolean) => {
      if (!runner || !accessToken) {
        return;
      }

      let confirmMessage: string;

      if (hidden) {
        confirmMessage = `Êtes vous sûr de vouloir masquer le passage n°${passage.id} (${formatDateAsString(passage.processed.lapEndTime)}) ?`;
      } else {
        confirmMessage = `Êtes vous sûr de vouloir rendre public le passage n°${passage.id} (${formatDateAsString(passage.processed.lapEndTime)}) ?`;
      }

      if (!window.confirm(confirmMessage)) {
        return;
      }

      const result = await patchAdminRunnerPassage(accessToken, runner.id, passage.id, { isHidden: hidden });

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        return;
      }

      ToastService.getToastr().success(hidden ? "Le passage a été masqué" : "Le passage n'est plus masqué");

      void fetchRunner();
    },
    [accessToken, runner, fetchRunner],
  );

  const updatePassage = useCallback(
    async (passage: AdminProcessedPassage, time: Date) => {
      if (!runner || !accessToken) {
        return;
      }

      const result = await patchAdminRunnerPassage(accessToken, runner.id, passage.id, {
        time: formatDateForApi(time),
      });

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        return;
      }

      ToastService.getToastr().success("Le temps de passage a bien été modifié");

      void fetchRunner();
    },
    [accessToken, runner, fetchRunner],
  );

  const saveNewPassage = useCallback(
    async (time: Date) => {
      if (!runner || !accessToken) {
        return;
      }

      const result = await postAdminRunnerPassage(accessToken, runner.id, {
        isHidden: false,
        time: formatDateForApi(time),
      });

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        return;
      }

      ToastService.getToastr().success("Le passage a bien été créé");

      void fetchRunner();
    },
    [accessToken, runner, fetchRunner],
  );

  const deletePassage = useCallback(
    async (passage: AdminProcessedPassage) => {
      if (!runner || !accessToken) {
        return;
      }

      let confirmMessage = `Êtes vous sûr de vouloir supprimer le passage n°${passage.id} (${formatDateAsString(passage.processed.lapEndTime)}) ?`;

      if (passage.detectionId !== null) {
        confirmMessage +=
          "\n\nAttention, le passage ayant été importé depuis le système de chronométrage, il sera réimporté si il y est toujours présent. Préférez masquer le passage plutôt que de le supprimer si vous souhaitez qu'il n'apparaisse plus au public.";
      }

      if (!window.confirm(confirmMessage)) {
        return;
      }

      const result = await deleteAdminRunnerPassage(accessToken, runner.id, passage.id);

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        return;
      }

      ToastService.getToastr().success("Le passage a été supprimé");

      void fetchRunner();
    },
    [accessToken, runner, fetchRunner],
  );

  useEffect(() => {
    void fetchRaces();
  }, [fetchRaces]);

  useEffect(() => {
    void fetchRunner();
  }, [fetchRunner]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!runner || !accessToken) {
        return;
      }

      setIsSaving(true);

      const idHasChanged = runnerId !== runner.id;

      const body = {
        id: runnerId,
        firstname: runnerFirstname,
        lastname: runnerLastname,
        birthYear: parseInt(runnerBirthYear),
        gender: runnerGender,
        stopped: runnerStopped,
        raceId: runnerRaceId,
      };

      const result = await patchAdminRunner(accessToken, runner.id, body);

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        setIsSaving(false);
        return;
      }

      ToastService.getToastr().success("Détails du coureur enregistrés");

      if (idHasChanged) {
        navigate(`/admin/runners/${runnerId}`, { replace: true });
        return;
      } else {
        await fetchRunner();
      }

      setIsSaving(false);
    },
    [
      runner,
      accessToken,
      runnerId,
      runnerFirstname,
      runnerLastname,
      runnerBirthYear,
      runnerGender,
      runnerStopped,
      runnerRaceId,
      navigate,
      fetchRunner,
    ],
  );

  const deleteRunner = useCallback(async () => {
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
    >
      <Row>
        <Col>
          <Breadcrumbs>
            <Crumb url="/admin" label="Administration" />
            <Crumb url="/admin/runners" label="Coureurs" />
            {(() => {
              if (runner === undefined) {
                return <CircularLoader />;
              }

              return <Crumb label={`${runner.lastname.toUpperCase()} ${runner.firstname}`} />;
            })()}
          </Breadcrumbs>
        </Col>
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
              <RunnerDetailsForm
                onSubmit={(e) => {
                  void onSubmit(e);
                }}
                id={runnerId}
                setId={setRunnerId}
                firstname={runnerFirstname}
                setFirstname={setRunnerFirstname}
                lastname={runnerLastname}
                setLastname={setRunnerLastname}
                gender={runnerGender}
                setGender={setRunnerGender}
                birthYear={runnerBirthYear}
                setBirthYear={setRunnerBirthYear}
                stopped={runnerStopped}
                setStopped={setRunnerStopped}
                races={races}
                raceId={runnerRaceId}
                setRaceId={setRunnerRaceId}
                submitButtonDisabled={isSaving || !unsavedChanges}
              />
            </Col>
          </Row>

          <Row>
            <Col className="mt-3">
              <h3>Passages</h3>

              <RunnerDetailsPassages
                passages={runner.passages}
                runnerRace={runnerRace}
                updatePassageVisiblity={updatePassageVisiblity}
                updatePassage={updatePassage}
                saveNewPassage={saveNewPassage}
                deletePassage={deletePassage}
              />
            </Col>
          </Row>

          <Row>
            <Col className="mt-3">
              <h3>Supprimer le coureur</h3>

              <p>Tous les passages liés à ce coureur seront également supprimés. Cette action est irréversible.</p>

              <button
                className="button red mt-3"
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
