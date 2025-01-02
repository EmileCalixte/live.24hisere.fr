import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { AdminEditionWithRaceCount, AdminRace } from "@live24hisere/core/types";
import { getAdminEditions } from "../../../../services/api/editionService";
import { getAdminRaces, postAdminRace } from "../../../../services/api/raceService";
import { getRaceCreateBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import type { SelectOption } from "../../../../types/Forms";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { getRacesSelectOptions } from "../../../../utils/raceUtils";
import { formatDateForApi } from "../../../../utils/utils";
import { appContext } from "../../../App";
import Select from "../../../ui/forms/Select";
import Page from "../../../ui/Page";
import RaceDetailsForm from "../../../viewParts/admin/races/RaceDetailsForm";

export default function CreateRaceAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const [existingRaces, setExistingRaces] = React.useState<AdminRace[] | false>(false);
  const [editions, setEditions] = React.useState<AdminEditionWithRaceCount[] | false>(false);

  const [raceEditionId, setRaceEditionId] = React.useState(0);
  const [raceName, setRaceName] = React.useState("");
  const [initialDistance, setInitialDistance] = React.useState<number | string>(0);
  const [lapDistance, setLapDistance] = React.useState<number | string>(0);
  const [startTime, setStartTime] = React.useState(new Date());
  const [duration, setDuration] = React.useState(60 * 60 * 24 * 1000);
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

  const existingRacesOptions = React.useMemo(
    () =>
      getRacesSelectOptions(existingRaces, (race) => {
        const edition = editions ? editions.find((edition) => edition.id === race.editionId) : undefined;

        if (edition) {
          return `${race.name} - ${edition.name}`;
        }

        return race.name;
      }),
    [editions, existingRaces],
  );

  const onSelectRaceToCopy = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!existingRaces) {
        return;
      }

      const raceToCopy = existingRaces.find((race) => race.id.toString() === e.target.value);

      if (!raceToCopy) {
        return;
      }

      setRaceEditionId(raceToCopy.editionId);
      setRaceName(raceToCopy.name);
      setInitialDistance(raceToCopy.initialDistance);
      setLapDistance(raceToCopy.lapDistance);
      setStartTime(new Date(raceToCopy.startTime));
      setDuration(raceToCopy.duration * 1000);
    },
    [existingRaces],
  );

  const fetchExistingRaces = React.useCallback(async () => {
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

  const onSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!accessToken) {
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

      const result = await postAdminRace(accessToken, body);

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        setIsSaving(false);
        return;
      }

      ToastService.getToastr().success("Course créée");
      navigate(`/admin/races/${result.json.race.id}`);
    },
    [accessToken, raceEditionId, raceName, isPublic, startTime, duration, initialDistance, lapDistance, navigate],
  );

  React.useEffect(() => {
    void fetchExistingRaces();
  }, [fetchExistingRaces]);

  React.useEffect(() => {
    void fetchEditions();
  }, [fetchEditions]);

  return (
    <Page id="admin-create-race" title="Créer une course">
      <Row>
        <Col>{getRaceCreateBreadcrumbs()}</Col>
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
            submitButtonDisabled={isSaving}
          />
        </Col>
      </Row>
    </Page>
  );
}
