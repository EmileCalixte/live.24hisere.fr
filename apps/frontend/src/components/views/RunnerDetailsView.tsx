import React from "react";
import { faCircleInfo, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryState } from "nuqs";
import { useNavigate, useParams } from "react-router-dom";
import { stringUtils } from "@live24hisere/utils";
import { SearchParam } from "../../constants/searchParams";
import { appContext } from "../../contexts/AppContext";
import { useGetPublicEditions } from "../../hooks/api/requests/public/editions/useGetPublicEditions";
import { useGetPublicRunnerParticipations } from "../../hooks/api/requests/public/participants/useGetPublicRunnerParticipations";
import { useGetPublicRaces } from "../../hooks/api/requests/public/races/useGetPublicRaces";
import { useGetPublicRaceRunners } from "../../hooks/api/requests/public/runners/useGetPublicRaceRunners";
import { useGetPublicRunners } from "../../hooks/api/requests/public/runners/useGetPublicRunners";
import { useProcessedRunnersWithProcessedHours } from "../../hooks/runners/useProcessedRunnersWithProcessedHours";
import { useRaceSelectOptions } from "../../hooks/useRaceSelectOptions";
import { useRanking } from "../../hooks/useRanking";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../utils/countryUtils";
import { generateXlsxFromData } from "../../utils/excelUtils";
import { isRaceFinished } from "../../utils/raceUtils";
import { getDataForExcelExport, getRaceRunnerFromRunnerAndParticipant } from "../../utils/runnerUtils";
import { Card } from "../ui/Card";
import CircularLoader from "../ui/CircularLoader";
import { Flag } from "../ui/countries/Flag";
import Select from "../ui/forms/Select";
import { Link } from "../ui/Link";
import Page from "../ui/Page";
import RunnerStoppedTooltip from "../ui/tooltips/RunnerStoppedTooltip";
import SpeedChart from "../viewParts/runnerDetails/charts/SpeedChart";
import RunnerDetailsLaps from "../viewParts/runnerDetails/RunnerDetailsLaps";
import RunnerDetailsStats from "../viewParts/runnerDetails/RunnerDetailsStats";
import RunnerSelector from "../viewParts/runnerDetails/RunnerSelector";

export default function RunnerDetailsView(): React.ReactElement {
  const { serverTimeOffset } = React.useContext(appContext).appData;

  const { runnerId } = useParams(); // This param is optional, undefined if no runner selected

  const [selectedRaceId, setSelectedRaceId] = useQueryState(SearchParam.RACE);

  const navigate = useNavigate();

  const getEditionsQuery = useGetPublicEditions();
  const editions = getEditionsQuery.data?.editions;

  const getRacesQuery = useGetPublicRaces();
  const races = getRacesQuery.data?.races;

  const selectedRace = React.useMemo(
    () => races?.find((race) => race.id.toString() === selectedRaceId),
    [races, selectedRaceId],
  );

  const selectedRaceEdition = React.useMemo(() => {
    if (!editions || !selectedRace) {
      return undefined;
    }

    return editions.find((edition) => edition.id === selectedRace.editionId);
  }, [editions, selectedRace]);

  const allRacesOptions = useRaceSelectOptions(races, (race) => {
    const edition = editions?.find((edition) => edition.id === race.editionId);

    if (edition) {
      return `${edition.name} – ${race.name}`;
    }

    return race.name;
  });

  const getRunnersQuery = useGetPublicRunners();
  const runners = getRunnersQuery.data?.runners;

  const selectedRunner = React.useMemo(() => {
    if (!runners || runnerId === undefined) {
      return undefined;
    }

    return runners.find((runner) => runner.id.toString() === runnerId);
  }, [runnerId, runners]);

  const getRunnerParticipationsQuery = useGetPublicRunnerParticipations(selectedRunner?.id);
  const runnerParticipations = getRunnerParticipationsQuery.data?.participations;

  const runnerRaceIds = React.useMemo(
    () => new Set(runnerParticipations?.map((participation) => participation.raceId)),
    [runnerParticipations],
  );

  const runnerHasMultipleParticipations = runnerParticipations && runnerParticipations.length >= 2;

  const runnerRaceOptions = allRacesOptions.filter((option) => runnerRaceIds.has(option.value));

  const selectedParticipation = React.useMemo(
    () => runnerParticipations?.find((participation) => participation.raceId === selectedRace?.id),
    [runnerParticipations, selectedRace?.id],
  );

  const selectedRaceRunner = React.useMemo(() => {
    if (!selectedRunner || !selectedParticipation) {
      return undefined;
    }

    return getRaceRunnerFromRunnerAndParticipant(selectedRunner, selectedParticipation);
  }, [selectedParticipation, selectedRunner]);

  const getRaceRunnersQuery = useGetPublicRaceRunners(selectedRaceId ?? undefined);
  const raceRunners = getRaceRunnersQuery.data?.runners;

  const processedRaceRunners = useProcessedRunnersWithProcessedHours(raceRunners, selectedRace);

  const ranking = useRanking(selectedRace, processedRaceRunners);

  const selectedRankingRunner = React.useMemo(
    () => ranking?.find((runner) => runner.id === selectedRaceRunner?.id),
    [ranking, selectedRaceRunner?.id],
  );

  const onSelectRunner = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      void navigate(`/runner-details/${e.target.value}${window.location.search}`);
    },
    [navigate],
  );

  const exportRunnerToXlsx = React.useCallback(() => {
    if (!selectedRace || !selectedRaceEdition || !selectedRankingRunner) {
      return;
    }

    const filename =
      `${selectedRankingRunner.firstname} ${selectedRankingRunner.lastname} - ${selectedRace.name} - ${selectedRaceEdition.name}`.trim();

    generateXlsxFromData(getDataForExcelExport(selectedRankingRunner), filename);
  }, [selectedRace, selectedRaceEdition, selectedRankingRunner]);

  // Redirect to runner-details without selected runner if selected runner ID is unknown
  React.useEffect(() => {
    if (!runners || runnerId === undefined) {
      return;
    }

    if (runners.find((runner) => runner.id.toString() === runnerId) === undefined) {
      void navigate("/runner-details");
    }
  }, [runners, runnerId, navigate]);

  // Remove race query param if selected runner has no participation in corresponding race
  React.useEffect(() => {
    if (!selectedRunner || !runnerParticipations) {
      return;
    }

    if (
      runnerParticipations.find((participation) => participation.raceId.toString() === selectedRaceId) === undefined
    ) {
      void setSelectedRaceId(null);
    }
  }, [runnerParticipations, selectedRaceId, selectedRunner, setSelectedRaceId]);

  // Auto-select first participation race (participations are ordered by edition order and race order) if no race selected
  React.useEffect(() => {
    if (!selectedRunner || !runnerParticipations) {
      return;
    }

    if (selectedRaceId === null && runnerParticipations.length > 0) {
      void setSelectedRaceId(runnerParticipations[0].raceId.toString());
    }
  }, [runnerParticipations, selectedRaceId, selectedRunner, setSelectedRaceId]);

  const alpha2CountryCode = getCountryAlpha2CodeFromAlpha3Code(selectedRaceRunner?.countryCode ?? null);

  // const isRaceInProgress = !!selectedRace && !isRaceFinished(selectedRace, serverTimeOffset);

  return (
    <Page
      id="runner-details"
      htmlTitle={
        selectedRunner === undefined
          ? "Détails coureur"
          : `Détails coureur ${selectedRunner.firstname} ${selectedRunner.lastname}`
      }
      contentClassName="flex flex-col gap-4"
    >
      <h1>Détails coureur</h1>

      <div className="flex w-full flex-col gap-1 md:w-[50%] xl:w-[25%] print:hidden">
        <RunnerSelector runners={runners} onSelectRunner={onSelectRunner} selectedRunnerId={runnerId} />

        <div className="flex justify-end">
          <Link to="/runner-details/search" icon={<FontAwesomeIcon icon={faSearch} />}>
            <span>Rechercher un coureur</span>
          </Link>
        </div>
      </div>

      {runnerId === undefined && <p>Sélectionnez un coureur ci-dessus pour consulter ses détails.</p>}

      {runnerId !== undefined && !selectedRaceRunner && (
        <Card>
          <p>
            <CircularLoader asideText="Chargement des données" />
          </p>
        </Card>
      )}

      {selectedRaceRunner && (
        <Card className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="flex items-center gap-2">
              {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}

              <span>
                {selectedRaceRunner.lastname.toUpperCase()} {selectedRaceRunner.firstname}
              </span>
            </h2>

            <div>
              {runnerHasMultipleParticipations ? (
                <div className="w-full md:w-[50%] xl:w-[25%]">
                  <Select
                    label="Course"
                    options={runnerRaceOptions}
                    value={selectedRace?.id}
                    onChange={(e) => {
                      void setSelectedRaceId(e.target.value);
                    }}
                  />
                </div>
              ) : (
                <p>{stringUtils.joinNonEmpty([selectedRaceEdition?.name, selectedRace?.name], " – ")}</p>
              )}
            </div>

            {selectedParticipation && (
              <p>
                <strong>Dossard n° {selectedParticipation.bibNumber}</strong>
              </p>
            )}

            {selectedRace && !isRaceFinished(selectedRace, serverTimeOffset) && selectedRankingRunner?.stopped && (
              <p className="font-bold text-red-600">
                Coureur arrêté
                <RunnerStoppedTooltip className="ms-2">
                  <FontAwesomeIcon icon={faCircleInfo} />
                </RunnerStoppedTooltip>
              </p>
            )}
          </div>

          {selectedRankingRunner && selectedRace && ranking ? (
            <div className="flex flex-col gap-3">
              <RunnerDetailsStats runner={selectedRankingRunner} race={selectedRace} ranking={ranking} />

              {selectedRankingRunner.totalAverageSpeed !== null && !selectedRace.isBasicRanking && (
                <SpeedChart
                  runner={selectedRankingRunner}
                  race={selectedRace}
                  averageSpeed={selectedRankingRunner.totalAverageSpeed}
                />
              )}

              {!selectedRace.isBasicRanking && (
                <RunnerDetailsLaps
                  runner={selectedRankingRunner}
                  race={selectedRace}
                  exportRunnerToXlsx={exportRunnerToXlsx}
                />
              )}
            </div>
          ) : (
            <p>
              <CircularLoader asideText="Chargement des données" />
            </p>
          )}
        </Card>
      )}
    </Page>
  );
}
