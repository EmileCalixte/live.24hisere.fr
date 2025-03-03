import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { AdminRunner } from "@live24hisere/core/types";
import { appContext } from "../../../../contexts/AppContext";
import { useGetAdminEdition } from "../../../../hooks/api/requests/admin/editions/useGetAdminEdition";
import { usePostAdminRaceRunner } from "../../../../hooks/api/requests/admin/participants/usePostAdminRaceRunner";
import { useGetAdminRace } from "../../../../hooks/api/requests/admin/races/useGetAdminRace";
import { useGetAdminRaceRunners } from "../../../../hooks/api/requests/admin/runners/useGetAdminRaceRunners";
import { useGetAdminRunners } from "../../../../hooks/api/requests/admin/runners/useGetAdminRunners";
import { useRequiredParams } from "../../../../hooks/useRequiredParams";
import { getCreateParticipantBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import type { SelectOption } from "../../../../types/Forms";
import { is404Error } from "../../../../utils/apiUtils";
import { spaceshipRunnersByName } from "../../../../utils/runnerUtils";
import CircularLoader from "../../../ui/CircularLoader";
import { Checkbox } from "../../../ui/forms/Checkbox";
import Page from "../../../ui/Page";
import ParticipantDetailsForm from "../../../viewParts/admin/participants/ParticipantDetailsForm";

export default function CreateParticipantAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const { raceId: urlRaceId } = useRequiredParams(["raceId"]);

  const getRaceQuery = useGetAdminRace(urlRaceId);
  const race = getRaceQuery.data?.race;
  const isRaceNotFound = is404Error(getRaceQuery.error);

  const getRaceRunnersQuery = useGetAdminRaceRunners(race?.id);
  const raceRunners = getRaceRunnersQuery.data?.runners;

  const postRaceRunnerMutation = usePostAdminRaceRunner(race?.id);

  const getRunnersQuery = useGetAdminRunners();
  const allRunners = getRunnersQuery.data?.runners;

  const getEditionQuery = useGetAdminEdition(race?.editionId);
  const edition = getEditionQuery.data?.edition;

  const [runnerId, setRunnerId] = React.useState<number | undefined>(undefined);
  const [bibNumber, setBibNumber] = React.useState<number | undefined>(undefined);
  const [isStopped, setIsStopped] = React.useState(false);
  const [finalDistance, setFinalDistance] = React.useState<number | string>(0);

  const [redirectToCreatedParticipant, setRedirectToCreatedParticipant] = React.useState(true);

  const alreadyParticipatingRunnerIds = React.useMemo(() => {
    const ids = new Set<number>();

    raceRunners?.forEach((runner) => ids.add(runner.id));

    return ids;
  }, [raceRunners]);

  const raceUnavailableBibNumbers = React.useMemo(() => {
    const bibNumbers = new Set<number>();

    raceRunners?.forEach((runner) => bibNumbers.add(runner.bibNumber));

    return bibNumbers;
  }, [raceRunners]);

  const isBibNumberAvailable = bibNumber === undefined || !raceUnavailableBibNumbers.has(bibNumber);

  const runnerOptions = React.useMemo<Array<SelectOption<AdminRunner["id"]>>>(
    () =>
      allRunners?.toSorted(spaceshipRunnersByName).map((runner) => {
        const isAlreadyParticipating = alreadyParticipatingRunnerIds.has(runner.id);

        return {
          label: `${runner.lastname.toUpperCase()} ${runner.firstname}${isAlreadyParticipating ? " (déjà participant)" : ""}`,
          value: runner.id,
          disabled: isAlreadyParticipating,
        };
      }) ?? [],
    [allRunners, alreadyParticipatingRunnerIds],
  );

  const clearForm = React.useCallback(() => {
    setRunnerId(undefined);
    setBibNumber((bibNumber) => (typeof bibNumber === "number" ? bibNumber + 1 : undefined));
    setIsStopped(false);
  }, []);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    if (!accessToken || !race || runnerId === undefined || bibNumber === undefined) {
      return;
    }

    const body = {
      runnerId,
      bibNumber,
      stopped: isStopped,
      finalDistance: finalDistance.toString(),
    };

    postRaceRunnerMutation.mutate(body, {
      onSuccess: ({ participant }) => {
        if (redirectToCreatedParticipant) {
          void navigate(`/admin/races/${race.id}/runners/${participant.runnerId}`);
        } else {
          clearForm();
          void getRaceRunnersQuery.refetch();
        }
      },
    });
  };

  if (isRaceNotFound) {
    void navigate("/admin");
  }

  return (
    <Page
      id="admin-create-participant"
      title={race ? `Ajouter un coureur à la course ${race.name}` : "Chargement"}
      className="d-flex flex-column gap-3"
    >
      <Row>
        <Col>{getCreateParticipantBreadcrumbs(edition ?? undefined, race ?? undefined)}</Col>
      </Row>

      {!race && <CircularLoader />}

      {race && (
        <Row className="d-flex flex-column gap-3">
          <Col sm={12}>
            <Checkbox
              label="Rediriger vers les détails de la participation une fois le coureur ajouté à la course"
              checked={redirectToCreatedParticipant}
              onChange={() => {
                setRedirectToCreatedParticipant((value) => !value);
              }}
            />
          </Col>

          <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
            <ParticipantDetailsForm
              isBasicRanking={race.isBasicRanking}
              onSubmit={onSubmit}
              runnerOptions={allRunners && raceRunners ? runnerOptions : false}
              runnerId={runnerId}
              onRunnerChange={(e) => {
                setRunnerId(parseInt(e.target.value));
              }}
              bibNumber={bibNumber}
              setBibNumber={setBibNumber}
              isBibNumberAvailable={isBibNumberAvailable}
              isStopped={isStopped}
              setIsStopped={setIsStopped}
              finalDistance={finalDistance}
              setFinalDistance={setFinalDistance}
              submitButtonDisabled={
                postRaceRunnerMutation.isPending
                || !isBibNumberAvailable
                || bibNumber === undefined
                || runnerId === undefined
              }
            />
          </Col>
        </Row>
      )}
    </Page>
  );
}
