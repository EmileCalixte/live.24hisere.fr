import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import type { AdminProcessedPassage } from "@live24hisere/core/types";
import { useGetAdminEdition } from "../../../../hooks/api/requests/admin/editions/useGetAdminEdition";
import { useGetAdminRaceRunner } from "../../../../hooks/api/requests/admin/participants/useGetAdminRaceRunner";
import { usePatchAdminRaceRunner } from "../../../../hooks/api/requests/admin/participants/usePatchAdminRaceRunner";
import { useDeleteAdminPassage } from "../../../../hooks/api/requests/admin/passages/useDeleteAdminPassage";
import { usePatchAdminPassage } from "../../../../hooks/api/requests/admin/passages/usePatchAdminPassage";
import { usePostAdminPassage } from "../../../../hooks/api/requests/admin/passages/usePostAdminPassage";
import { useGetAdminRace } from "../../../../hooks/api/requests/admin/races/useGetAdminRace";
import { useGetAdminRaceRunners } from "../../../../hooks/api/requests/admin/runners/useGetAdminRaceRunners";
import { useRequiredParams } from "../../../../hooks/useRequiredParams";
import { getParticipantBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { is404Error } from "../../../../utils/apiUtils";
import { getProcessedPassagesFromPassages } from "../../../../utils/passageUtils";
import { formatDateAsString, formatDateForApi } from "../../../../utils/utils";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import ParticipantDetailsForm from "../../../viewParts/admin/participants/ParticipantDetailsForm";
import ParticipantDetailsPassages from "../../../viewParts/admin/participants/ParticipantDetailsPassages";

export default function ParticipantDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { raceId: urlRaceId, runnerId: urlRunnerId } = useRequiredParams(["raceId", "runnerId"]);

  const getRaceQuery = useGetAdminRace(urlRaceId);
  const race = getRaceQuery.data?.race;
  const isRaceNotFound = is404Error(getRaceQuery.error);

  const getRunnerQuery = useGetAdminRaceRunner(urlRaceId, urlRunnerId);
  const runner = getRunnerQuery.data?.runner;
  const isRunnerNotFound = is404Error(getRunnerQuery.error);

  const getRaceRunnersQuery = useGetAdminRaceRunners(race?.id);
  const raceRunners = getRaceRunnersQuery.data?.runners;

  const getEditionQuery = useGetAdminEdition(race?.editionId);
  const edition = getEditionQuery.data?.edition;

  const patchRunnerMutation = usePatchAdminRaceRunner(race?.id, runner?.id);

  const postPassageMutation = usePostAdminPassage();
  const patchPassageMutation = usePatchAdminPassage();
  const deletePassageMutation = useDeleteAdminPassage();

  const [participantBibNumber, setParticipantBibNumber] = React.useState(0);
  const [participantIsStopped, setParticipantIsStopped] = React.useState(false);
  const [participantDistanceAfterLastPassage, setParticipantDistanceAfterLastPassage] = React.useState<number | string>(
    0,
  );

  const unsavedChanges = React.useMemo(() => {
    if (!runner) {
      return false;
    }

    return [
      participantBibNumber === runner.bibNumber,
      participantIsStopped === runner.stopped,
      participantDistanceAfterLastPassage.toString() === runner.distanceAfterLastPassage.toString(),
    ].includes(false);
  }, [runner, participantBibNumber, participantIsStopped, participantDistanceAfterLastPassage]);

  const processedPassages = React.useMemo(() => {
    if (!race || !runner) {
      return [];
    }

    return getProcessedPassagesFromPassages(race, runner.passages);
  }, [race, runner]);

  function updatePassageVisiblity(passage: AdminProcessedPassage, hidden: boolean): void {
    if (!runner) {
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
          void getRunnerQuery.refetch();
        },
      },
    );
  }

  function updatePassage(passage: AdminProcessedPassage, time: Date): void {
    if (!runner) {
      return;
    }

    patchPassageMutation.mutate(
      { passageId: passage.id, passage: { time: formatDateForApi(time) } },
      {
        onSuccess: () => {
          void getRunnerQuery.refetch();
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
          void getRunnerQuery.refetch();
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
        void getRunnerQuery.refetch();
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
    if (!runner) {
      return;
    }

    setParticipantBibNumber(runner.bibNumber);
    setParticipantIsStopped(runner.stopped);
    setParticipantDistanceAfterLastPassage(runner.distanceAfterLastPassage);
  }, [runner]);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    if (!race || !runner) {
      return;
    }

    const body = {
      bibNumber: participantBibNumber,
      stopped: participantIsStopped,
      distanceAfterLastPassage: participantDistanceAfterLastPassage.toString(),
    };

    patchRunnerMutation.mutate(body, {
      onSuccess: () => {
        void getRunnerQuery.refetch();
      },
    });
  };

  if (isRaceNotFound) {
    void navigate("/admin");
  }

  if (race && isRunnerNotFound) {
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
                onSubmit={onSubmit}
                bibNumber={participantBibNumber}
                setBibNumber={setParticipantBibNumber}
                isBibNumberAvailable={isBibNumberAvailable}
                isStopped={participantIsStopped}
                setIsStopped={setParticipantIsStopped}
                distanceAfterLastPassage={participantDistanceAfterLastPassage}
                setDistanceAfterLastPassage={setParticipantDistanceAfterLastPassage}
                submitButtonDisabled={patchRunnerMutation.isPending || !unsavedChanges || !isBibNumberAvailable}
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
