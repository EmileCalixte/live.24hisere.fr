import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGetAdminEditions } from "../../../../hooks/api/requests/admin/editions/useGetAdminEditions";
import { useGetAdminRaces } from "../../../../hooks/api/requests/admin/races/useGetAdminRaces";
import { usePostAdminRace } from "../../../../hooks/api/requests/admin/races/usePostAdminRace";
import { useRaceSelectOptions } from "../../../../hooks/useRaceSelectOptions";
import { getRaceCreateBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import type { SelectOption } from "../../../../types/Forms";
import { formatDateForApi } from "../../../../utils/utils";
import Select from "../../../ui/forms/Select";
import Page from "../../../ui/Page";
import RaceDetailsForm from "../../../viewParts/admin/races/RaceDetailsForm";

export default function CreateRaceAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const getEditionsQuery = useGetAdminEditions();
  const editions = getEditionsQuery.data?.editions;

  const getRacesQuery = useGetAdminRaces();
  const existingRaces = getRacesQuery.data?.races;

  const postRaceMutation = usePostAdminRace();

  const [raceEditionId, setRaceEditionId] = React.useState(0);
  const [raceName, setRaceName] = React.useState("");
  const [initialDistance, setInitialDistance] = React.useState<number | string>(0);
  const [lapDistance, setLapDistance] = React.useState<number | string>(0);
  const [startTime, setStartTime] = React.useState(new Date());
  const [duration, setDuration] = React.useState(60 * 60 * 24 * 1000);
  const [isPublic, setIsPublic] = React.useState(false);
  const [isImmediateStop, setIsImmediateStop] = React.useState(false);
  const [isBasicRanking, setIsBasicRanking] = React.useState(false);

  const editionOptions = React.useMemo<Array<SelectOption<number>>>(() => {
    if (!editions) {
      return [];
    }

    return editions.map((edition) => ({
      label: edition.name,
      value: edition.id,
    }));
  }, [editions]);

  const existingRacesOptions = useRaceSelectOptions(existingRaces, (race) => {
    const edition = editions?.find((edition) => edition.id === race.editionId);

    if (edition) {
      return `${race.name} - ${edition.name}`;
    }

    return race.name;
  });

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

  React.useEffect(() => {
    if (editionOptions.length > 0) {
      setRaceEditionId(editionOptions[0].value);
    }
  }, [editionOptions]);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    const body = {
      editionId: raceEditionId,
      name: raceName,
      isPublic,
      startTime: formatDateForApi(startTime),
      duration: Math.floor(duration / 1000),
      initialDistance: initialDistance.toString(),
      lapDistance: lapDistance.toString(),
      isImmediateStop,
      isBasicRanking,
    };

    postRaceMutation.mutate(body, {
      onSuccess: ({ race }) => {
        void navigate(`/admin/races/${race.id}`);
      },
    });
  };

  return (
    <Page id="admin-create-race" htmlTitle="Créer une course">
      <Row>
        <Col>{getRaceCreateBreadcrumbs()}</Col>
      </Row>

      <Row>
        <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
          <Select
            label="Copier les paramètres d'une course existante"
            options={existingRacesOptions}
            disabled={existingRaces && existingRaces.length === 0}
            isLoading={getRacesQuery.isLoading}
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
            isImmediateStop={isImmediateStop}
            setIsImmediateStop={setIsImmediateStop}
            isBasicRanking={isBasicRanking}
            setIsBasicRanking={setIsBasicRanking}
            submitButtonDisabled={postRaceMutation.isPending}
          />
        </Col>
      </Row>
    </Page>
  );
}
