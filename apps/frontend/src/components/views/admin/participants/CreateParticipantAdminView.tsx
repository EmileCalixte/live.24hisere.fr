import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { type AdminEdition, type AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import { getAdminEdition } from "../../../../services/api/editionService";
import { getAdminRace } from "../../../../services/api/raceService";
import { getCreateParticipantBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import ParticipantDetailsForm from "../../../viewParts/admin/participants/ParticipantDetailsForm";

export default function CreateParticipantAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const { raceId: urlRaceId } = useParams();

  const [edition, setEdition] = React.useState<AdminEdition | undefined | null>(undefined);
  const [race, setRace] = React.useState<AdminRaceWithRunnerCount | undefined | null>(undefined);

  const [bibNumber, setBibNumber] = React.useState(0);
  const [isStopped, setIsStopped] = React.useState(false);

  const [isSaving] = React.useState(false);

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

  React.useEffect(() => {
    void fetchEdition();
  }, [fetchEdition]);

  React.useEffect(() => {
    void fetchRace();
  }, [fetchRace]);

  const onSubmit = React.useCallback(async (e: React.FormEvent) => {
    console.log("TODO");
  }, []);

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
        <Row>
          <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
            <ParticipantDetailsForm
              onSubmit={(e) => {
                void onSubmit(e);
              }}
              bibNumber={bibNumber}
              setBibNumber={setBibNumber}
              isStopped={isStopped}
              setIsStopped={setIsStopped}
              submitButtonDisabled={isSaving}
            />
          </Col>
        </Row>
      )}
    </Page>
  );
}
