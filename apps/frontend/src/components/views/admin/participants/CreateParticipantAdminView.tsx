import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import type { AdminEdition, AdminRaceWithRunnerCount, AdminRunner, RaceRunner } from "@live24hisere/core/types";
import { getAdminEdition } from "../../../../services/api/editionService";
import { postAdminRaceRunner } from "../../../../services/api/participantService";
import { getAdminRace } from "../../../../services/api/raceService";
import { getAdminRaceRunners, getAdminRunners } from "../../../../services/api/runnerService";
import { getCreateParticipantBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import type { SelectOption } from "../../../../types/Forms";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import CircularLoader from "../../../ui/CircularLoader";
import { Checkbox } from "../../../ui/forms/Checkbox";
import Page from "../../../ui/Page";
import ParticipantDetailsForm from "../../../viewParts/admin/participants/ParticipantDetailsForm";

export default function CreateParticipantAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const { raceId: urlRaceId } = useParams();

  const [edition, setEdition] = React.useState<AdminEdition | undefined | null>(undefined);
  const [race, setRace] = React.useState<AdminRaceWithRunnerCount | undefined | null>(undefined);
  const [raceRunners, setRaceRunners] = React.useState<Array<RaceRunner<AdminRunner>> | undefined | null>(undefined);
  const [allRunners, setAllRunners] = React.useState<AdminRunner[] | undefined | null>(undefined);

  const [runnerId, setRunnerId] = React.useState<number | undefined>(undefined);
  const [bibNumber, setBibNumber] = React.useState<number | undefined>(undefined);
  const [isStopped, setIsStopped] = React.useState(false);

  const [redirectToCreatedParticipant, setRedirectToCreatedParticipant] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

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

  const fetchRunners = React.useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminRunners(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des coureurs");
      setAllRunners(null);
      return;
    }

    setAllRunners(result.json.runners);
  }, [accessToken]);

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
      allRunners?.map((runner) => {
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

  const onSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!accessToken || !race || runnerId === undefined || bibNumber === undefined) {
        return;
      }

      setIsSaving(true);

      const body = {
        runnerId,
        bibNumber,
        stopped: isStopped,
      };

      const result = await postAdminRaceRunner(accessToken, race.id, body);

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        setIsSaving(false);
        return;
      }

      ToastService.getToastr().success("Coureur ajouté à la course");

      if (redirectToCreatedParticipant) {
        navigate(`/admin/races/${race.id}/runners/${runnerId}`);
      } else {
        clearForm();
        void fetchRaceRunners();
      }

      setIsSaving(false);
    },
    [
      accessToken,
      bibNumber,
      clearForm,
      fetchRaceRunners,
      isStopped,
      navigate,
      race,
      redirectToCreatedParticipant,
      runnerId,
    ],
  );

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
    void fetchRunners();
  }, [fetchRunners]);

  if (race === null) {
    navigate("/admin");
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
              onSubmit={(e) => {
                void onSubmit(e);
              }}
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
              submitButtonDisabled={
                isSaving || !isBibNumberAvailable || bibNumber === undefined || runnerId === undefined
              }
            />
          </Col>
        </Row>
      )}
    </Page>
  );
}
