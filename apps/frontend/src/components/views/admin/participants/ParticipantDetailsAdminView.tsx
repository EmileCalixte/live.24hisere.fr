import React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import type { AdminProcessedPassage } from "@live24hisere/core/types";
import { stringUtils } from "@live24hisere/utils";
import { useGetAdminEdition } from "../../../../hooks/api/requests/admin/editions/useGetAdminEdition";
import { useDeleteAdminRaceRunner } from "../../../../hooks/api/requests/admin/participants/useDeleteAdminRaceRunner";
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
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { Button } from "../../../ui/forms/Button";
import { Link } from "../../../ui/Link";
import Page from "../../../ui/Page";
import { Separator } from "../../../ui/Separator";
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
  const deleteRunnerMutation = useDeleteAdminRaceRunner(race?.id, runner?.id);

  const postPassageMutation = usePostAdminPassage();
  const patchPassageMutation = usePatchAdminPassage();
  const deletePassageMutation = useDeleteAdminPassage();

  const [participantBibNumber, setParticipantBibNumber] = React.useState(0);
  const [participantIsStopped, setParticipantIsStopped] = React.useState(false);
  const [participantFinalDistance, setParticipantFinalDistance] = React.useState<number | string>(0);

  const [isAddingPassage, setIsAddingPassage] = React.useState(false);

  const unsavedChanges = React.useMemo(() => {
    if (!runner) {
      return false;
    }

    return [
      participantBibNumber === runner.bibNumber,
      participantIsStopped === runner.stopped,
      participantFinalDistance.toString() === runner.finalDistance.toString(),
    ].includes(false);
  }, [runner, participantBibNumber, participantIsStopped, participantFinalDistance]);

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

  function updatePassage(passage: AdminProcessedPassage, time: Date, comment: string | null): void {
    if (!runner) {
      return;
    }

    patchPassageMutation.mutate(
      {
        passageId: passage.id,
        passage: { time: formatDateForApi(time), comment: stringUtils.nonEmptyOrNull(comment) },
      },
      {
        onSuccess: () => {
          void getRunnerQuery.refetch();
        },
      },
    );
  }

  function saveNewPassage(time: Date, comment: string | null): void {
    if (!race || !runner) {
      return;
    }

    postPassageMutation.mutate(
      {
        raceId: race.id,
        runnerId: runner.id,
        isHidden: false,
        time: formatDateForApi(time),
        comment: stringUtils.nonEmptyOrNull(comment),
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
    setParticipantFinalDistance(runner.finalDistance);
  }, [runner]);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    if (!race || !runner) {
      return;
    }

    const body = {
      bibNumber: participantBibNumber,
      stopped: participantIsStopped,
      finalDistance: participantFinalDistance.toString(),
    };

    patchRunnerMutation.mutate(body, {
      onSuccess: () => {
        void getRunnerQuery.refetch();
      },
    });
  };

  function deleteParticipant(): void {
    if (!race || !runner) {
      return;
    }

    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ce participant et ses passages ?`)) {
      return;
    }

    deleteRunnerMutation.mutate(undefined, {
      onSuccess: () => {
        void navigate(`/admin/races/${race.id}`);
      },
    });
  }

  if (isRaceNotFound) {
    void navigate("/admin");
  }

  if (race && isRunnerNotFound) {
    void navigate(`/admin/races/${race.id}`);
  }

  return (
    <Page
      id="admin-race-runner-details"
      htmlTitle={runner ? `Détails de la participation de ${runner.firstname} ${runner.lastname}` : "Chargement"}
      title={
        !runner || !race ? undefined : (
          <>
            Détails de la participation de
            <> </>
            <Link to={`/admin/runners/${runner.id}`}>
              {runner.firstname} {runner.lastname}
            </Link>
            <> </>à la course
            <> </>
            <Link to={`/admin/races/${race.id}`}>{race.name}</Link>
          </>
        )
      }
      breadCrumbs={getParticipantBreadcrumbs(edition ?? undefined, race ?? undefined, runner ?? undefined)}
    >
      {!race || !runner ? (
        <CircularLoader />
      ) : (
        <Card className="flex flex-col gap-3">
          <div className="w-full md:w-1/2 xl:w-1/4">
            <ParticipantDetailsForm
              isBasicRanking={race.isBasicRanking}
              onSubmit={onSubmit}
              bibNumber={participantBibNumber}
              setBibNumber={setParticipantBibNumber}
              isBibNumberAvailable={isBibNumberAvailable}
              isStopped={participantIsStopped}
              setIsStopped={setParticipantIsStopped}
              finalDistance={participantFinalDistance}
              setFinalDistance={setParticipantFinalDistance}
              submitButtonDisabled={patchRunnerMutation.isPending || !unsavedChanges || !isBibNumberAvailable}
            />
          </div>

          <Separator className="my-5" />

          <h2 className="flex flex-wrap items-center gap-5">
            Passages
            <span className="text-base">
              <Button
                variant="button"
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={() => {
                  setIsAddingPassage(true);
                }}
              >
                Ajouter manuellement
              </Button>
            </span>
          </h2>

          <ParticipantDetailsPassages
            passages={processedPassages}
            runnerRace={race}
            isAddingPassage={isAddingPassage}
            setIsAddingPassage={setIsAddingPassage}
            updatePassageVisiblity={updatePassageVisiblity}
            updatePassage={updatePassage}
            saveNewPassage={saveNewPassage}
            deletePassage={deletePassage}
          />

          <Separator className="my-5" />

          <h2>Retirer le coureur de la course</h2>

          {runner.passages.length > 0 && <p>Les {runner.passages.length} du participant seront également supprimés.</p>}

          <div>
            <Button color="red" isLoading={deleteRunnerMutation.isPending} onClick={deleteParticipant}>
              Supprimer le participant
            </Button>
          </div>
        </Card>
      )}
    </Page>
  );
}
