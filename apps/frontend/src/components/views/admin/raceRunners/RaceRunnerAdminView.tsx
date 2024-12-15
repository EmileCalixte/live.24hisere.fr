import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  type AdminProcessedPassage,
  type AdminRaceRunnerWithPassages,
  type AdminRaceWithRunnerCount,
} from "@live24hisere/core/types";
import { getAdminRaceRunner } from "../../../../services/api/participantService";
import { deleteAdminPassage, patchAdminPassage, postAdminPassage } from "../../../../services/api/passageService";
import { getAdminRace } from "../../../../services/api/raceService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { getProcessedPassagesFromPassages } from "../../../../utils/passageUtils";
import { formatDateAsString, formatDateForApi } from "../../../../utils/utils";
import { appContext } from "../../../App";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import RaceRunnerDetailsPassages from "../../../viewParts/admin/runners/RaceRunnerDetailsPassages";

export default function RacesAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const { raceId: urlRaceId, runnerId: urlRunnerId } = useParams();

  const [race, setRace] = React.useState<AdminRaceWithRunnerCount | undefined | null>(undefined);
  const [runner, setRunner] = React.useState<AdminRaceRunnerWithPassages | undefined | null>(undefined);

  const processedPassages = React.useMemo(() => {
    if (!race || !runner) {
      return [];
    }

    return getProcessedPassagesFromPassages(race, runner.passages);
  }, [race, runner]);

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

  const updatePassageVisiblity = React.useCallback(
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
      {(!race || !runner) && <CircularLoader />}
      {race && runner && (
        <Row>
          <Col>
            <h3>Passages</h3>

            <RaceRunnerDetailsPassages
              passages={processedPassages}
              runnerRace={race}
              updatePassageVisiblity={updatePassageVisiblity}
              updatePassage={updatePassage}
              saveNewPassage={saveNewPassage}
              deletePassage={deletePassage}
            />
          </Col>
        </Row>
      )}
    </Page>
  );
}
