import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { type AdminRace } from "@live24hisere/core/types";
import { getAdminRaces, postAdminRace } from "../../../../services/api/raceService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { getRacesSelectOptions } from "../../../../utils/raceUtils";
import { formatDateForApi } from "../../../../utils/utils";
import { appContext } from "../../../App";
import Breadcrumbs from "../../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../../ui/breadcrumbs/Crumb";
import Select from "../../../ui/forms/Select";
import Page from "../../../ui/Page";
import RaceDetailsForm from "../../../viewParts/admin/races/RaceDetailsForm";

export default function CreateRaceAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = useContext(appContext).user;

  const [existingRaces, setExistingRaces] = useState<AdminRace[] | false>(false);

  const [raceName, setRaceName] = useState("");
  const [initialDistance, setInitialDistance] = useState<number | string>(0);
  const [lapDistance, setLapDistance] = useState<number | string>(0);
  const [startTime, setStartTime] = useState(new Date());
  const [duration, setDuration] = useState(60 * 60 * 24 * 1000);
  const [isPublic, setIsPublic] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const existingRacesOptions = useMemo(() => getRacesSelectOptions(existingRaces), [existingRaces]);

  const onSelectRaceToCopy = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!existingRaces) {
        return;
      }

      const raceToCopy = existingRaces.find((race) => race.id.toString() === e.target.value);

      if (!raceToCopy) {
        return;
      }

      setRaceName(raceToCopy.name);
      setInitialDistance(raceToCopy.initialDistance);
      setLapDistance(raceToCopy.lapDistance);
      setStartTime(new Date(raceToCopy.startTime));
      setDuration(raceToCopy.duration * 1000);
    },
    [existingRaces],
  );

  const fetchExistingRaces = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminRaces(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des courses existantes");
      return;
    }

    setExistingRaces(result.json.races);
  }, [accessToken]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!accessToken) {
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

      const result = await postAdminRace(accessToken, body);

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        setIsSaving(false);
        return;
      }

      ToastService.getToastr().success("Course créée");
      navigate(`/admin/races/${result.json.race.id}`);
    },
    [accessToken, raceName, isPublic, initialDistance, lapDistance, startTime, duration, navigate],
  );

  useEffect(() => {
    void fetchExistingRaces();
  }, [fetchExistingRaces]);

  return (
    <Page id="admin-create-race" title="Créer une course">
      <Row>
        <Col>
          <Breadcrumbs>
            <Crumb url="/admin" label="Administration" />
            <Crumb url="/admin/races" label="Courses" />
            <Crumb label="Créer une course" />
          </Breadcrumbs>
        </Col>
      </Row>

      <Row>
        <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
          <Select
            label="Copier les paramètres d'une course existante"
            options={existingRacesOptions}
            disabled={existingRaces && existingRaces.length === 0}
            isLoading={existingRaces === false}
            loadingOptionLabel="Chargement des courses"
            placeholderLabel={
              existingRaces && existingRaces.length === 0
                ? "Aucune course à copier"
                : "Sélectionnez une course à copier"
            }
            onChange={onSelectRaceToCopy}
          />
        </Col>
      </Row>

      <Row>
        <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
          <h2>Créer une course</h2>

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
            submitButtonDisabled={isSaving}
          />
        </Col>
      </Row>
    </Page>
  );
}
