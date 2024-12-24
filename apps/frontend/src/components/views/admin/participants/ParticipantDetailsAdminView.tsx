import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  type AdminEdition,
  type AdminProcessedPassage,
  type AdminRaceRunnerWithPassages,
  type AdminRaceWithRunnerCount,
  type AdminRunner,
  type RaceRunner,
} from "@live24hisere/core/types";
import { getAdminEdition } from "../../../../services/api/editionService";
import { getAdminRaceRunner, patchAdminRaceRuner } from "../../../../services/api/participantService";
import { deleteAdminPassage, patchAdminPassage, postAdminPassage } from "../../../../services/api/passageService";
import { getAdminRace } from "../../../../services/api/raceService";
import { getAdminRaceRunners } from "../../../../services/api/runnerService";
import { getParticipantBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { getProcessedPassagesFromPassages } from "../../../../utils/passageUtils";
import { formatDateAsString, formatDateForApi } from "../../../../utils/utils";
import { appContext } from "../../../App";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import ParticipantDetailsForm from "../../../viewParts/admin/participants/ParticipantDetailsForm";
import ParticipantDetailsPassages from "../../../viewParts/admin/participants/ParticipantDetailsPassages";

export default function ParticipantDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const { raceId: urlRaceId, runnerId: urlRunnerId } = useParams();

  const [edition, setEdition] = React.useState<AdminEdition | undefined | null>(undefined);
  const [race, setRace] = React.useState<AdminRaceWithRunnerCount | undefined | null>(undefined);
  const [raceRunners, setRaceRunners] = React.useState<Array<RaceRunner<AdminRunner>> | undefined | null>(undefined);

  const [runner, setRunner] = React.useState<AdminRaceRunnerWithPassages | undefined | null>(undefined);

  const [participantBibNumber, setParticipantBibNumber] = React.useState(0);
  const [participantIsStopped, setParticipantIsStopped] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);

  const unsavedChanges = React.useMemo(() => {
    if (!runner) {
      return false;
    }

    return [participantBibNumber === runner.bibNumber, participantIsStopped === runner.stopped].includes(false);
  }, [runner, participantBibNumber, participantIsStopped]);

  const processedPassages = React.useMemo(() => {
    if (!race || !runner) {
      return [];
    }

    return getProcessedPassagesFromPassages(race, runner.passages);
  }, [race, runner]);

  const fetchEdition = React.useCallback(async () => {
    if (!race || !accessToken) {
      return;
    }

    const result = await getAdminEdition(accessToken, race.editionId);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer les détails de l'édition");
      setEdition(null);
      return;
    }

    setEdition(result.json.edition);
  }, [accessToken, race]);

  const fetchRace = React.useCallback(async () => {
    if (!urlRaceId || !accessToken) {
      return;
    }

    const result = await getAdminRace(accessToken, urlRaceId);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer les détails de la course");
      setRace(null);
      return;
    }

    setRace(result.json.race);
  }, [accessToken, urlRaceId]);

  const fetchRaceRunners = React.useCallback(async () => {
    if (!urlRaceId || !accessToken) {
      return;
    }

    const result = await getAdminRaceRunners(accessToken, urlRaceId);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer les coureurs participant déjà à la course");
      setRace(null);
      return;
    }

    setRaceRunners(result.json.runners);
  }, [accessToken, urlRaceId]);

  const fetchRunner = React.useCallback(async () => {
    if (!urlRaceId || !urlRunnerId || !accessToken) {
      return;
    }

    const result = await getAdminRaceRunner(accessToken, urlRaceId, urlRunnerId);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer les détails du coureur");
      setRunner(null);
      return;
    }

    const runner = result.json.runner;

    setRunner(runner);

    setParticipantBibNumber(runner.bibNumber);
    setParticipantIsStopped(runner.stopped);
  }, [accessToken, urlRaceId, urlRunnerId]);

  const updatePassageVisiblity = React.useCallback(
    async (passage: AdminProcessedPassage, hidden: boolean) => {
      if (!runner || !accessToken) {
        return;
      }

      const confirmMessage = hidden
        ? `Êtes vous sûr de vouloir masquer le passage n°${passage.id} (${formatDateAsString(passage.processed.lapEndTime)}) ?`
        : `Êtes vous sûr de vouloir rendre public le passage n°${passage.id} (${formatDateAsString(passage.processed.lapEndTime)}) ?`;

      if (!window.confirm(confirmMessage)) {
        return;
      }

      const result = await patchAdminPassage(accessToken, passage.id, { isHidden: hidden });

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        return;
      }

      ToastService.getToastr().success(hidden ? "Le passage a été masqué" : "Le passage n'est plus masqué");

      void fetchRunner();
    },
    [accessToken, runner, fetchRunner],
  );

  const updatePassage = React.useCallback(
    async (passage: AdminProcessedPassage, time: Date) => {
      if (!runner || !accessToken) {
        return;
      }

      const result = await patchAdminPassage(accessToken, passage.id, {
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

  const saveNewPassage = React.useCallback(
    async (time: Date) => {
      if (!race || !runner || !accessToken) {
        return;
      }

      const result = await postAdminPassage(accessToken, {
        raceId: race.id,
        runnerId: runner.id,
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
    [accessToken, race, runner, fetchRunner],
  );

  const deletePassage = React.useCallback(
    async (passage: AdminProcessedPassage) => {
      if (!accessToken) {
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

      const result = await deleteAdminPassage(accessToken, passage.id);

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        return;
      }

      ToastService.getToastr().success("Le passage a été supprimé");

      void fetchRunner();
    },
    [accessToken, fetchRunner],
  );

  const raceUnavailableBibNumbers = React.useMemo(() => {
    const bibNumbers = new Set<number>();

    raceRunners?.forEach((runner) => bibNumbers.add(runner.bibNumber));

    return bibNumbers;
  }, [raceRunners]);

  const isBibNumberAvailable =
    participantBibNumber === runner?.bibNumber || !raceUnavailableBibNumbers.has(participantBibNumber);

  React.useEffect(() => {
    void fetchEdition();
  }, [fetchEdition]);

  React.useEffect(() => {
    void fetchRace();
  }, [fetchRace]);

  React.useEffect(() => {
    void fetchRaceRunners();
  }, [fetchRaceRunners]);

  React.useEffect(() => {
    void fetchRunner();
  }, [fetchRunner]);

  const onSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!accessToken || !race || !runner) {
        return;
      }

      setIsSaving(true);

      const body = {
        bibNumber: participantBibNumber,
        stopped: participantIsStopped,
      };

      const result = await patchAdminRaceRuner(accessToken, race.id, runner.id, body);

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        setIsSaving(false);
        return;
      }

      ToastService.getToastr().success("Informations enregistrées");
      setIsSaving(false);
    },
    [accessToken, participantBibNumber, participantIsStopped, race, runner],
  );

  if (race === null) {
    navigate("/admin");
  }

  if (race && runner === null) {
    navigate(`/admin/races/${race.id}`);
  }

  return (
    <Page
      id="admin-race-runner-details"
      title={runner ? `Détails de la participation de ${runner.firstname} ${runner.lastname}` : "Chargement"}
      className="d-flex flex-column gap-3"
    >
      <Row>
        <Col>{getParticipantBreadcrumbs(edition ?? undefined, race ?? undefined, runner ?? undefined)}</Col>
      </Row>

      {(!race || !runner) && <CircularLoader />}
      {race && runner && (
        <>
          <Row>
            <Col>
              <h2>
                Détails de la participation de
                <> </>
                <Link to={`/admin/runners/${runner.id}`}>
                  {runner.firstname} {runner.lastname}
                </Link>
                <> </>à la course
                <> </>
                <Link to={`/admin/races/${race.id}`}>{race.name}</Link>
              </h2>
            </Col>
          </Row>

          <Row>
            <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
              <ParticipantDetailsForm
                onSubmit={(e) => {
                  void onSubmit(e);
                }}
                bibNumber={participantBibNumber}
                setBibNumber={setParticipantBibNumber}
                isBibNumberAvailable={isBibNumberAvailable}
                isStopped={participantIsStopped}
                setIsStopped={setParticipantIsStopped}
                submitButtonDisabled={isSaving || !unsavedChanges || !isBibNumberAvailable}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <h3>Passages</h3>

              <ParticipantDetailsPassages
                passages={processedPassages}
                runnerRace={race}
                updatePassageVisiblity={updatePassageVisiblity}
                updatePassage={updatePassage}
                saveNewPassage={saveNewPassage}
                deletePassage={deletePassage}
              />
            </Col>
          </Row>
        </>
      )}
    </Page>
  );
}
