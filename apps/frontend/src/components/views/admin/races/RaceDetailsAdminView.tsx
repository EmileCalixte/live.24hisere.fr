import React from "react";
import { faCheck, faFlagCheckered, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navigate, useNavigate, useParams } from "react-router-dom";
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
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { Button } from "../../../ui/forms/Button";
import { Input } from "../../../ui/forms/Input";
import { Link } from "../../../ui/Link";
import Page from "../../../ui/Page";
import { Separator } from "../../../ui/Separator";
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
      initialDistance.toString() === race.initialDistance,
      lapDistance.toString() === race.lapDistance,
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
      htmlTitle={race === undefined ? "Chargement" : `Détails de la course ${race.name}`}
      title={race === undefined ? undefined : `Détails de la course ${race.name}`}
      breadCrumbs={getRaceDetailsBreadcrumbs(edition, race)}
    >
      {race === undefined ? (
        <CircularLoader />
      ) : (
        <Card className="flex flex-col gap-3">
          <h2>Détails de la course</h2>

          <div className="w-full md:w-1/2 xl:w-1/4">
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
          </div>

          <Separator className="my-5" />

          <h2 className="flex flex-wrap items-center gap-5">
            Participants
            <span className="text-base">
              <Link to={`/admin/races/${race.id}/add-runner`} variant="button" icon={<FontAwesomeIcon icon={faPlus} />}>
                Ajouter
              </Link>
            </span>
          </h2>

          {raceRunners === undefined && <CircularLoader />}

          {getRaceRunnersQuery.error && <p>Impossible de récupérer les coureurs</p>}

          {displayedRaceRunners && (
            <>
              {isEditingFinalDistances ? (
                <div>
                  <Button
                    className="button"
                    icon={<FontAwesomeIcon icon={faCheck} />}
                    onClick={() => {
                      void getRaceRunnersQuery.refetch({ cancelRefetch: false }).then(() => {
                        setIsEditingFinalDistances(false);
                      });
                    }}
                    disabled={getRaceRunnersQuery.isPending}
                  >
                    Terminer
                  </Button>
                </div>
              ) : (
                <div>
                  {displayedRaceRunners.length > 0 && (
                    <Button
                      color="orange"
                      icon={<FontAwesomeIcon icon={faFlagCheckered} />}
                      onClick={() => {
                        setIsEditingFinalDistances(true);
                      }}
                    >
                      Modifier les distances finales
                    </Button>
                  )}
                </div>
              )}

              {sortedRaceRunners && sortedRaceRunners.length > 0 && (
                <div className="w-full md:w-1/2 xl:w-1/4">
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
                </div>
              )}

              {displayedRaceRunners.length > 0 && (
                <div>
                  <RaceRunnersTable
                    race={race}
                    runners={displayedRaceRunners}
                    isEditingFinalDistances={isEditingFinalDistances}
                  />
                </div>
              )}

              {sortedRaceRunners && sortedRaceRunners.length > 0 && displayedRaceRunners.length === 0 && (
                <p>Aucun coureur ne correspond à cette recherche.</p>
              )}

              {sortedRaceRunners && sortedRaceRunners.length === 0 && <p>Aucun coureur ne participe à cette course.</p>}
            </>
          )}

          <Separator className="my-5" />

          <h2>Supprimer la course</h2>

          {race.runnerCount > 0 ? (
            <p>La course ne peut pas être supprimée tant qu'elle contient des coureurs.</p>
          ) : (
            <p>Cette action est irréversible.</p>
          )}

          <div>
            <Button
              color="red"
              disabled={race.runnerCount > 0}
              isLoading={deleteRaceMutation.isPending}
              onClick={deleteRace}
            >
              Supprimer la course
            </Button>
          </div>
        </Card>
      )}
    </Page>
  );
}
