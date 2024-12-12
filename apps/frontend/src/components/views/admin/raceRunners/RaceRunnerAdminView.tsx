import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type AdminRaceRunnerWithPassages, type AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import { getAdminRaceRunner } from "../../../../services/api/participantService";
import { getAdminRace } from "../../../../services/api/raceService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import Page from "../../../ui/Page";

export default function RacesAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const { raceId: urlRaceId, runnerId: urlRunnerId } = useParams();

  const [race, setRace] = React.useState<AdminRaceWithRunnerCount | undefined | null>(undefined);
  const [runner, setRunner] = React.useState<AdminRaceRunnerWithPassages | undefined | null>(undefined);

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

    setRunner(result.json.runner);
  }, [accessToken, urlRaceId, urlRunnerId]);

  React.useEffect(() => {
    void fetchRace();
  }, [fetchRace]);

  React.useEffect(() => {
    void fetchRunner();
  }, [fetchRunner]);

  if (race === null) {
    navigate("/admin");
  }

  if (race && runner === null) {
    navigate(`/admin/races/${race.id}`);
  }

  return (
    <Page id="admin-race-runner-details" title="TODO" className="d-flex flex-column gap-3">
      TODO
    </Page>
  );
}
