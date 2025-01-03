import React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import type {
  AdminEditionWithRaceCount,
  AdminRaceWithRunnerCount,
  AdminRunner,
  RaceRunner,
} from "@live24hisere/core/types";
import { getAdminEditions } from "../../../../services/api/editionService";
import { deleteAdminRace, getAdminRace, patchAdminRace } from "../../../../services/api/raceService";
import { getAdminRaceRunners } from "../../../../services/api/runnerService";
import { getRaceDetailsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import type { SelectOption } from "../../../../types/Forms";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { formatDateForApi } from "../../../../utils/utils";
import { appContext } from "../../../App";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import RaceDetailsForm from "../../../viewParts/admin/races/RaceDetailsForm";
import RaceRunnersTable from "../../../viewParts/admin/races/RaceRunnersTable";

export default function RaceDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const { raceId: urlRaceId } = useParams();

  const [race, setRace] = React.useState<AdminRaceWithRunnerCount | undefined | null>(undefined);
  const [raceRunners, setRaceRunners] = React.useState<Array<RaceRunner<AdminRunner>> | undefined | null>(undefined);
  const [editions, setEditions] = React.useState<AdminEditionWithRaceCount[] | false>(false);

  const [raceEditionId, setRaceEditionId] = React.useState(0);
  const [raceName, setRaceName] = React.useState("");
  const [initialDistance, setInitialDistance] = React.useState<number | string>(0);
  const [lapDistance, setLapDistance] = React.useState<number | string>(0);
  const [startTime, setStartTime] = React.useState(new Date(0));
  const [duration, setDuration] = React.useState(0);
  const [isPublic, setIsPublic] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);

  const editionOptions = React.useMemo<Array<SelectOption<number>>>(() => {
    if (!editions) {
      return [];
    }

    return editions.map((edition) => ({
      label: edition.name,
      value: edition.id,
    }));
  }, [editions]);

  const edition = React.useMemo(() => {
    if (!race || !editions) {
      return undefined;
    }

    return editions.find((edition) => edition.id === race.editionId);
  }, [race, editions]);

  const unsavedChanges = React.useMemo(() => {
    if (!race) {
      return false;
    }

    return [
      raceEditionId === race.editionId,
      raceName === race.name,
      initialDistance.toString() === race.initialDistance.toString(),
      lapDistance.toString() === race.lapDistance.toString(),
      startTime.getTime() === new Date(race.startTime).getTime(),
      duration === race.duration * 1000,
      isPublic === race.isPublic,
    ].includes(false);
  }, [race, raceEditionId, raceName, initialDistance, lapDistance, startTime, duration, isPublic]);

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

    const responseJson = result.json;

    setRace(responseJson.race);

    setRaceEditionId(responseJson.race.editionId);
    setRaceName(responseJson.race.name);
    setInitialDistance(responseJson.race.initialDistance);
    setLapDistance(responseJson.race.lapDistance);
    setStartTime(new Date(responseJson.race.startTime));
    setDuration(responseJson.race.duration * 1000);
    setIsPublic(responseJson.race.isPublic);
  }, [accessToken, urlRaceId]);

  const fetchRaceRunners = React.useCallback(async () => {
    if (!urlRaceId || !accessToken) {
      return;
    }

    const result = await getAdminRaceRunners(accessToken, urlRaceId);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer les coureurs");
      setRace(null);
      return;
    }

    setRaceRunners(result.json.runners);
  }, [accessToken, urlRaceId]);

  const fetchEditions = React.useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminEditions(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des éditions");
      return;
    }

    const responseJson = result.json;

    setEditions(responseJson.editions);
  }, [accessToken]);

  React.useEffect(() => {
    void fetchRace();
  }, [fetchRace]);

  React.useEffect(() => {
    void fetchRaceRunners();
  }, [fetchRaceRunners]);

  React.useEffect(() => {
    void fetchEditions();
  }, [fetchEditions]);

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!race || !accessToken) {
      return;
    }

    setIsSaving(true);

    const body = {
      editionId: raceEditionId,
      name: raceName,
      isPublic,
      startTime: formatDateForApi(startTime),
      duration: Math.floor(duration / 1000),
      initialDistance: initialDistance.toString(),
      lapDistance: lapDistance.toString(),
    };

    const result = await patchAdminRace(accessToken, race.id, body);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Une erreur est survenue");
      setIsSaving(false);
      return;
    }

    ToastService.getToastr().success("Paramètres de la course enregistrés");

    await fetchRace();
    setIsSaving(false);
  };

  const deleteRace = React.useCallback(async () => {
    if (!race || !accessToken) {
      return;
    }

    if (race.runnerCount > 0) {
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette course ?")) {
      return;
    }

    const result = await deleteAdminRace(accessToken, race.id);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Une erreur est survenue");
      return;
    }

    ToastService.getToastr().success("Course supprimée");
    void navigate("/admin/races");
  }, [accessToken, navigate, race]);

  if (race === null) {
    return <Navigate to="/admin/races" />;
  }

  return (
    <Page
      id="admin-race-details"
      title={race === undefined ? "Chargement" : `Détails de la course ${race.name}`}
      className="d-flex flex-column gap-3"
    >
      <Row>
        <Col>{getRaceDetailsBreadcrumbs(edition, race)}</Col>
      </Row>

      {race === undefined && (
        <Row>
          <Col>
            <CircularLoader />
          </Col>
        </Row>
      )}

      {race !== undefined && (
        <>
          <Row>
            <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
              <h3>Détails de la course</h3>

              <RaceDetailsForm
                onSubmit={onSubmit}
                editionOptions={editionOptions}
                editionId={raceEditionId}
                setEditionId={setRaceEditionId}
                name={raceName}
                setName={setRaceName}
                initialDistance={initialDistance}
                setInitialDistance={setInitialDistance}
                lapDistance={lapDistance}
                setLapDistance={setLapDistance}
                startTime={startTime}
                setStartTime={setStartTime}
                duration={duration}
                setDuration={setDuration}
                isPublic={isPublic}
                setIsPublic={setIsPublic}
                submitButtonDisabled={isSaving || !unsavedChanges}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <h3>Coureurs</h3>

              {raceRunners === undefined && <CircularLoader />}

              {raceRunners === null && <p>Impossible de récupérer les coureurs</p>}

              {raceRunners && (
                <>
                  <p>
                    <Link to={`/admin/races/${race.id}/add-runner`} className="button">
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Ajouter un coureur
                    </Link>
                  </p>

                  {raceRunners.length > 0 ? (
                    <RaceRunnersTable race={race} runners={raceRunners} />
                  ) : (
                    <p>Aucun coureur ne participe à cette course</p>
                  )}
                </>
              )}
            </Col>
          </Row>

          <Row>
            <Col>
              <h3>Supprimer la course</h3>

              {race.runnerCount > 0 ? (
                <p>La course ne peut pas être supprimée tant qu'elle contient des coureurs.</p>
              ) : (
                <p>Cette action est irréversible.</p>
              )}

              <button
                className="button red"
                disabled={race.runnerCount > 0}
                onClick={() => {
                  void deleteRace();
                }}
              >
                Supprimer la course
              </button>
            </Col>
          </Row>
        </>
      )}
    </Page>
  );
}
