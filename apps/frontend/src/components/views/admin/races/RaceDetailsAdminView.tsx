import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { type AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import { deleteAdminRace, getAdminRace, patchAdminRace } from "../../../../services/api/raceService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { formatDateForApi } from "../../../../utils/utils";
import { appContext } from "../../../App";
import Breadcrumbs from "../../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../../ui/breadcrumbs/Crumb";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import RaceDetailsForm from "../../../viewParts/admin/races/RaceDetailsForm";

export default function RaceDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = useContext(appContext).user;

  const { raceId: urlRaceId } = useParams();

  const [race, setRace] = useState<AdminRaceWithRunnerCount | undefined | null>(undefined);

  const [raceName, setRaceName] = useState("");
  const [initialDistance, setInitialDistance] = useState<number | string>(0);
  const [lapDistance, setLapDistance] = useState<number | string>(0);
  const [startTime, setStartTime] = useState(new Date(0));
  const [duration, setDuration] = useState(0);
  const [isPublic, setIsPublic] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const unsavedChanges = useMemo(() => {
    if (!race) {
      return false;
    }

    return [
      raceName === race.name,
      initialDistance.toString() === race.initialDistance.toString(),
      lapDistance.toString() === race.lapDistance.toString(),
      startTime.getTime() === new Date(race.startTime).getTime(),
      duration === race.duration * 1000,
      isPublic === race.isPublic,
    ].includes(false);
  }, [race, raceName, initialDistance, lapDistance, startTime, duration, isPublic]);

  const fetchRace = useCallback(async () => {
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

    setRaceName(responseJson.race.name);
    setInitialDistance(responseJson.race.initialDistance);
    setLapDistance(responseJson.race.lapDistance);
    setStartTime(new Date(responseJson.race.startTime));
    setDuration(responseJson.race.duration * 1000);
    setIsPublic(responseJson.race.isPublic);
  }, [accessToken, urlRaceId]);

  useEffect(() => {
    void fetchRace();
  }, [fetchRace]);

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!race || !accessToken) {
      return;
    }

    setIsSaving(true);

    const body = {
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

  const deleteRace = useCallback(async () => {
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
    navigate("/admin/races");
  }, [accessToken, navigate, race]);

  if (race === null) {
    return <Navigate to="/admin/races" />;
  }

  return (
    <Page id="admin-race-details" title={race === undefined ? "Chargement" : `Détails de la course ${race.name}`}>
      <Row>
        <Col>
          <Breadcrumbs>
            <Crumb url="/admin" label="Administration" />
            <Crumb url="/admin/races" label="Courses" />
            {(() => {
              if (race === undefined) {
                return <CircularLoader />;
              }

              return <Crumb label={race.name} />;
            })()}
          </Breadcrumbs>
        </Col>
      </Row>

      <Row>
        <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
          {race === undefined && <CircularLoader />}

          {race !== undefined && (
            <>
              <Row>
                <Col>
                  <RaceDetailsForm
                    onSubmit={onSubmit}
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
                  <h3>Supprimer la course</h3>

                  {race.runnerCount > 0 ? (
                    <p>La course ne peut pas être supprimée tant qu'elle contient des coureurs.</p>
                  ) : (
                    <p>Cette action est irréversible.</p>
                  )}

                  <button
                    className="button red mt-3"
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
        </Col>
      </Row>
    </Page>
  );
}
