import React from "react";
import { faCheck, faFlagCheckered, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { stringUtils } from "@live24hisere/utils";
import { spaceship } from "../../../../../../../packages/utils/src/compare-utils";
import { useGetAdminEditions } from "../../../../hooks/api/requests/admin/editions/useGetAdminEditions";
import { useDeleteAdminRace } from "../../../../hooks/api/requests/admin/races/useDeleteAdminRace";
import { useGetAdminRace } from "../../../../hooks/api/requests/admin/races/useGetAdminRace";
import { usePatchAdminRace } from "../../../../hooks/api/requests/admin/races/usePatchAdminRace";
import { useGetAdminRaceRunners } from "../../../../hooks/api/requests/admin/runners/useGetAdminRaceRunners";
import { getRaceDetailsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import type { SelectOption } from "../../../../types/Forms";
import { is404Error } from "../../../../utils/apiUtils";
import { formatDateForApi } from "../../../../utils/utils";
import CircularLoader from "../../../ui/CircularLoader";
import { Input } from "../../../ui/forms/Input";
import Page from "../../../ui/Page";
import RaceDetailsForm from "../../../viewParts/admin/races/RaceDetailsForm";
import RaceRunnersTable from "../../../viewParts/admin/races/RaceRunnersTable";

export default function RaceDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { raceId: urlRaceId } = useParams();

  const getRaceQuery = useGetAdminRace(urlRaceId);
  const race = getRaceQuery.data?.race;
  const isRaceNotFound = is404Error(getRaceQuery.error);

  const patchRaceMutation = usePatchAdminRace(race?.id);
  const deleteRaceMutation = useDeleteAdminRace(race?.id);

  const getRaceRunnersQuery = useGetAdminRaceRunners(race?.id);
  const raceRunners = getRaceRunnersQuery.data?.runners;

  const getEditionsQuery = useGetAdminEditions();
  const editions = getEditionsQuery.data?.editions;

  const [raceEditionId, setRaceEditionId] = React.useState(0);
  const [raceName, setRaceName] = React.useState("");
  const [initialDistance, setInitialDistance] = React.useState<number | string>(0);
  const [lapDistance, setLapDistance] = React.useState<number | string>(0);
  const [startTime, setStartTime] = React.useState(new Date(0));
  const [duration, setDuration] = React.useState(0);
  const [isPublic, setIsPublic] = React.useState(false);
  const [isImmediateStop, setIsImmediateStop] = React.useState(false);
  const [isBasicRanking, setIsBasicRanking] = React.useState(false);

  const [isEditingFinalDistances, setIsEditingFinalDistances] = React.useState(false);

  const [search, setSearch] = React.useState("");

  const sortedRaceRunners = React.useMemo(() => {
    if (!raceRunners) {
      return undefined;
    }

    return raceRunners.toSorted((a, b) => spaceship(a.bibNumber, b.bibNumber));
  }, [raceRunners]);

  const displayedRaceRunners = React.useMemo(() => {
    if (!sortedRaceRunners) {
      return undefined;
    }

    const trimmedSearch = search.trim();

    if (trimmedSearch.length < 1) {
      return sortedRaceRunners;
    }

    return sortedRaceRunners.filter((runner) => {
      const firstnameMatches = stringUtils.latinizedIncludes(runner.firstname, trimmedSearch);
      const lastnameMatches = stringUtils.latinizedIncludes(runner.lastname, trimmedSearch);
      const bibNumberMatches = runner.bibNumber.toString().includes(trimmedSearch);

      return firstnameMatches || lastnameMatches || bibNumberMatches;
    });
  }, [search, sortedRaceRunners]);

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
    if (!race) {
      return undefined;
    }

    return editions?.find((edition) => edition.id === race.editionId);
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
      isImmediateStop === race.isImmediateStop,
      isBasicRanking === race.isBasicRanking,
    ].includes(false);
  }, [
    race,
    raceEditionId,
    raceName,
    initialDistance,
    lapDistance,
    startTime,
    duration,
    isPublic,
    isImmediateStop,
    isBasicRanking,
  ]);

  React.useEffect(() => {
    if (!race) {
      return;
    }

    setRaceEditionId(race.editionId);
    setRaceName(race.name);
    setInitialDistance(race.initialDistance);
    setLapDistance(race.lapDistance);
    setStartTime(new Date(race.startTime));
    setDuration(race.duration * 1000);
    setIsPublic(race.isPublic);
    setIsImmediateStop(race.isImmediateStop);
    setIsBasicRanking(race.isBasicRanking);
  }, [race]);

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

    patchRaceMutation.mutate(body, {
      onSuccess: () => {
        void getRaceQuery.refetch();
      },
    });
  };

  function deleteRace(): void {
    if (!race || race.runnerCount > 0) {
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette course ?")) {
      return;
    }

    deleteRaceMutation.mutate(undefined, {
      onSuccess: () => {
        void navigate("/admin/races");
      },
    });
  }

  if (isRaceNotFound) {
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
                isImmediateStop={isImmediateStop}
                setIsImmediateStop={setIsImmediateStop}
                isBasicRanking={isBasicRanking}
                setIsBasicRanking={setIsBasicRanking}
                submitButtonDisabled={patchRaceMutation.isPending || getRaceQuery.isPending || !unsavedChanges}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <h3>Participants</h3>
            </Col>
          </Row>

          {raceRunners === undefined && <CircularLoader />}

          {getRaceRunnersQuery.error && (
            <Row>
              <Col>
                <p>Impossible de récupérer les coureurs</p>
              </Col>
            </Row>
          )}

          {displayedRaceRunners && (
            <>
              <Row>
                <Col className="d-flex gap-2 mb-2">
                  {isEditingFinalDistances ? (
                    <button
                      className="button"
                      onClick={() => {
                        void getRaceRunnersQuery.refetch({ cancelRefetch: false }).then(() => {
                          setIsEditingFinalDistances(false);
                        });
                      }}
                      disabled={getRaceRunnersQuery.isPending}
                    >
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                      Terminer
                    </button>
                  ) : (
                    <>
                      <p className="m-0">
                        <Link to={`/admin/races/${race.id}/add-runner`} className="button">
                          <FontAwesomeIcon icon={faPlus} className="me-2" />
                          Ajouter un coureur
                        </Link>
                      </p>
                      {displayedRaceRunners.length > 0 && (
                        <button
                          className="button orange"
                          onClick={() => {
                            setIsEditingFinalDistances(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faFlagCheckered} className="me-2" />
                          Modifier les distances finales
                        </button>
                      )}
                    </>
                  )}
                </Col>
              </Row>

              {sortedRaceRunners && sortedRaceRunners.length > 0 && (
                <Row>
                  <Col lg={3} md={4} sm={6} xs={12}>
                    <Input
                      label="Rechercher"
                      placeholder="Nom, prénom ou dossard"
                      autoComplete="off"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      disabled={isEditingFinalDistances}
                    />
                  </Col>
                </Row>
              )}

              <Row>
                <Col>
                  {displayedRaceRunners.length > 0 && (
                    <RaceRunnersTable
                      race={race}
                      runners={displayedRaceRunners}
                      isEditingFinalDistances={isEditingFinalDistances}
                    />
                  )}

                  {sortedRaceRunners && sortedRaceRunners.length > 0 && displayedRaceRunners.length === 0 && (
                    <p>Aucun coureur ne correspond à cette recherche.</p>
                  )}

                  {sortedRaceRunners && sortedRaceRunners.length === 0 && (
                    <p>Aucun coureur ne participe à cette course.</p>
                  )}
                </Col>
              </Row>
            </>
          )}

          <Row>
            <Col>
              <h3>Supprimer la course</h3>

              {race.runnerCount > 0 ? (
                <p>La course ne peut pas être supprimée tant qu'elle contient des coureurs.</p>
              ) : (
                <p>Cette action est irréversible.</p>
              )}

              <button className="button red" disabled={race.runnerCount > 0} onClick={deleteRace}>
                Supprimer la course
              </button>
            </Col>
          </Row>
        </>
      )}
    </Page>
  );
}
