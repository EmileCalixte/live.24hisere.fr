import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import type { AdminProcessedPassage, AdminRaceRunnerWithPassages } from "@live24hisere/core/types";
import { useGetAdminEdition } from "../../../../hooks/api/requests/admin/editions/useGetAdminEdition";
import { useDeleteAdminPassage } from "../../../../hooks/api/requests/admin/passages/useDeleteAdminPassage";
import { usePatchAdminPassage } from "../../../../hooks/api/requests/admin/passages/usePatchAdminPassage";
import { usePostAdminPassage } from "../../../../hooks/api/requests/admin/passages/usePostAdminPassage";
import { useGetAdminRace } from "../../../../hooks/api/requests/admin/races/useGetAdminRace";
import { useGetAdminRaceRunners } from "../../../../hooks/api/requests/admin/runners/useGetAdminRaceRunners";
import { useRequiredParams } from "../../../../hooks/useRequiredParams";
import { getAdminRaceRunner, patchAdminRaceRuner } from "../../../../services/api/participantService";
import { getParticipantBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import { is404Error, isApiRequestResultOk } from "../../../../utils/apiUtils";
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

  const { raceId: urlRaceId, runnerId: urlRunnerId } = useRequiredParams(["raceId", "runnerId"]);

  const getRaceQuery = useGetAdminRace(urlRaceId);
  const race = getRaceQuery.data?.race;
  const isRaceNotFound = is404Error(getRaceQuery.error);

  const getRaceRunnersQuery = useGetAdminRaceRunners(race?.id);
  const raceRunners = getRaceRunnersQuery.data?.runners;

  const getEditionQuery = useGetAdminEdition(race?.editionId);
  const edition = getEditionQuery.data?.edition;

  const [runner, setRunner] = React.useState<AdminRaceRunnerWithPassages | undefined | null>(undefined);

  const postPassageMutation = usePostAdminPassage();
  const patchPassageMutation = usePatchAdminPassage();
  const deletePassageMutation = useDeleteAdminPassage();

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

  function updatePassageVisiblity(passage: AdminProcessedPassage, hidden: boolean): void {
    if (!runner || !accessToken) {
      return;
    }

    const confirmMessage = hidden
      ? `Êtes vous sûr de vouloir masquer le passage n°${passage.id} (${formatDateAsString(passage.processed.lapEndTime)}) ?`
      : `Êtes vous sûr de vouloir rendre public le passage n°${passage.id} (${formatDateAsString(passage.processed.lapEndTime)}) ?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    patchPassageMutation.mutate(
      { passageId: passage.id, passage: { isHidden: hidden } },
      {
        onSuccess: () => {
          void fetchRunner();
        },
      },
    );
  }

  function updatePassage(passage: AdminProcessedPassage, time: Date): void {
    if (!runner || !accessToken) {
      return;
    }

    patchPassageMutation.mutate(
      { passageId: passage.id, passage: { time: formatDateForApi(time) } },
      {
        onSuccess: () => {
          void fetchRunner();
        },
      },
    );
  }

  function saveNewPassage(time: Date): void {
    if (!race || !runner) {
      return;
    }

    postPassageMutation.mutate(
      {
        raceId: race.id,
        runnerId: runner.id,
        isHidden: false,
        time: formatDateForApi(time),
      },
      {
        onSuccess: () => {
          void fetchRunner();
        },
      },
    );
  }

  function deletePassage(passage: AdminProcessedPassage): void {
    let confirmMessage = `Êtes vous sûr de vouloir supprimer le passage n°${passage.id} (${formatDateAsString(passage.processed.lapEndTime)}) ?`;

    if (passage.detectionId !== null) {
      confirmMessage +=
        "\n\nAttention, le passage ayant été importé depuis le système de chronométrage, il sera réimporté si il y est toujours présent. Préférez masquer le passage plutôt que de le supprimer si vous souhaitez qu'il n'apparaisse plus au public.";
    }

    if (!window.confirm(confirmMessage)) {
      return;
    }

    deletePassageMutation.mutate(passage.id, {
      onSuccess: () => {
        void fetchRunner();
      },
    });
  }

  const raceUnavailableBibNumbers = React.useMemo(() => {
    const bibNumbers = new Set<number>();

    raceRunners?.forEach((runner) => bibNumbers.add(runner.bibNumber));

    return bibNumbers;
  }, [raceRunners]);

  const isBibNumberAvailable =
    participantBibNumber === runner?.bibNumber || !raceUnavailableBibNumbers.has(participantBibNumber);

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

  if (isRaceNotFound) {
    void navigate("/admin");
  }

  if (race && runner === null) {
    void navigate(`/admin/races/${race.id}`);
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
