import React from "react";
import { faCircleInfo, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useNavigate, useParams } from "react-router-dom";
import { arrayUtils, stringUtils } from "@live24hisere/utils";
import { TrackedEvent } from "../../constants/eventTracking/customEventNames";
import { SearchParam } from "../../constants/searchParams";
import { appDataContext } from "../../contexts/AppDataContext";
import { runnerDetailsViewContext, type RunnerDetailsViewContext } from "../../contexts/RunnerDetailsViewContext";
import { useGetPublicEditions } from "../../hooks/api/requests/public/editions/useGetPublicEditions";
import { useGetPublicRunnerParticipations } from "../../hooks/api/requests/public/participants/useGetPublicRunnerParticipations";
import { useGetPublicRaces } from "../../hooks/api/requests/public/races/useGetPublicRaces";
import { useGetPublicRaceRunners } from "../../hooks/api/requests/public/runners/useGetPublicRaceRunners";
import { useGetPublicRunners } from "../../hooks/api/requests/public/runners/useGetPublicRunners";
import { useProcessedRunnersWithProcessedHours } from "../../hooks/runners/useProcessedRunnersWithProcessedHours";
import { useRaceSelectOptions } from "../../hooks/useRaceSelectOptions";
import { useRanking } from "../../hooks/useRanking";
import { formatMsAsDuration } from "../../utils/durationUtils";
import { getDuvRunnerUrl } from "../../utils/duvUtils";
import { trackEvent } from "../../utils/eventTracking/eventTrackingUtils";
import { isRaceFinished } from "../../utils/raceUtils";
import { getRaceRunnerFromRunnerAndParticipant } from "../../utils/runnerUtils";
import { Card } from "../ui/Card";
import CircularLoader from "../ui/CircularLoader";
import Select from "../ui/forms/Select";
import { Link } from "../ui/Link";
import Page from "../ui/Page";
import RunnerStoppedPopover from "../ui/popovers/RunnerStoppedPopover";
import { Tab, TabContent, TabList, Tabs } from "../ui/Tabs";
import { RunnerNameWithIcons } from "../viewParts/races/RunnerNameWithIcons";
import RaceTimer from "../viewParts/RaceTimer";
import RunnerSelector from "../viewParts/runnerDetails/RunnerSelector";
import { SplitTabContent } from "../viewParts/runnerDetails/stats/SplitTabContent";
import { StatsTabContent } from "../viewParts/runnerDetails/stats/StatsTabContent";

const TAB_ID_STATS = "stats";
const TAB_ID_SPLIT = "split";

const TAB_IDS = [TAB_ID_STATS, TAB_ID_SPLIT] as const;

type TabId = (typeof TAB_IDS)[number];

export default function RunnerDetailsView(): React.ReactElement {
  const { serverTimeOffset } = React.useContext(appDataContext);

  const { runnerId } = useParams(); // This param is optional, undefined if no runner selected

  const [selectedRaceId, setSelectedRaceId] = useQueryState(SearchParam.RACE);
  const [selectedTab, setSelectedTab] = useQueryState(SearchParam.TAB, parseAsStringLiteral(TAB_IDS));
  const [isTabContentLoading, setIsTabContentLoading] = React.useState(false);

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

  const availableTabIds = React.useMemo(() => {
    if (selectedRace?.isBasicRanking) {
      return TAB_IDS.filter((t) => t !== TAB_ID_SPLIT);
    }

    return TAB_IDS;
  }, [selectedRace?.isBasicRanking]);

  const getRunnersQuery = useGetPublicRunners();
  const runners = getRunnersQuery.data?.runners;

  const selectedRunner = React.useMemo(() => {
    if (!runners || runnerId === undefined) {
      return null;
    }

    return runners.find((runner) => runner.id.toString() === runnerId) ?? null;
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

  const onRunnerSelect = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      void navigate(`/runner-details/${e.target.value}${window.location.search}`);
    },
    [navigate],
  );

  function onTabSelect(tab: TabId): void {
    trackEvent(TrackedEvent.RUNNER_DETAILS_VIEW_CHANGE_TAB, { tab });

    setIsTabContentLoading(true);
    void setSelectedTab(tab);

    React.startTransition(() => {
      setIsTabContentLoading(false);
    });
  }

  // Set default tab (we don't use nuqs `withDefault` because we always want the tab to be displayed in params)
  React.useEffect(() => {
    if (!arrayUtils.inArray(selectedTab, availableTabIds)) {
      void setSelectedTab(TAB_ID_STATS);
    }
  }, [availableTabIds, selectedTab, setSelectedTab]);

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

  const runnerDetailsViewContextValues: RunnerDetailsViewContext = {
    selectedRace,
    selectedRaceEdition,
    selectedRankingRunner,
    ranking,
  };

  return (
    <Page
      id="runner-details"
      title="Détails coureur"
      htmlTitle={
        selectedRunner === null
          ? "Détails coureur"
          : `Détails coureur ${selectedRunner.firstname} ${selectedRunner.lastname}`
      }
      layout="flexGap"
    >
      <div className="flex w-full flex-col gap-1 md:w-1/2 xl:w-1/3 2xl:w-1/4 print:hidden">
        <RunnerSelector runners={runners} onSelectRunner={onRunnerSelect} selectedRunnerId={runnerId} />

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
        <Card className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="flex items-center gap-2">
                <RunnerNameWithIcons runner={selectedRaceRunner} strongClassName="[font-weight:inherit]" />
              </h2>

              {selectedRaceRunner.duvRunnerId && (
                <div>
                  <p>
                    <Link to={getDuvRunnerUrl(selectedRaceRunner.duvRunnerId)} target="_blank" showExternalIcon>
                      Voir ce coureur sur DUV
                    </Link>
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              {selectedRace && (
                <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                  {runnerHasMultipleParticipations ? (
                    <div className="w-full md:w-1/2 xl:w-1/3 2xl:w-1/4">
                      <Select
                        label="Course"
                        options={runnerRaceOptions}
                        value={selectedRace.id}
                        onChange={(e) => {
                          void setSelectedRaceId(e.target.value);
                        }}
                      />
                    </div>
                  ) : (
                    <p>{stringUtils.joinNonEmpty([selectedRaceEdition?.name, selectedRace.name], " – ")}</p>
                  )}

                  {!isRaceFinished(selectedRace) && (
                    <span>
                      <b>
                        <RaceTimer race={selectedRace} />
                      </b>{" "}
                      / {formatMsAsDuration(selectedRace.duration * 1000)}
                    </span>
                  )}
                </div>
              )}

              {selectedParticipation && (
                <p>
                  <strong>Dossard n° {selectedParticipation.bibNumber}</strong>
                </p>
              )}

              {selectedRace && !isRaceFinished(selectedRace, serverTimeOffset) && selectedRankingRunner?.stopped && (
                <p className="flex gap-2 font-bold text-red-600">
                  Coureur arrêté
                  <RunnerStoppedPopover>
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </RunnerStoppedPopover>
                </p>
              )}
            </div>
          </div>

          {selectedRace && (
            <runnerDetailsViewContext.Provider value={runnerDetailsViewContextValues}>
              <Tabs
                value={selectedTab}
                onValueChange={(newValue: TabId) => {
                  onTabSelect(newValue);
                }}
                className="flex flex-col gap-5"
              >
                {!selectedRace.isBasicRanking && (
                  <div className="print:hidden">
                    <TabList>
                      <Tab value={TAB_ID_STATS}>Statistiques détaillées</Tab>
                      <Tab value={TAB_ID_SPLIT}>Temps intermédiaires</Tab>
                    </TabList>
                  </div>
                )}

                {isTabContentLoading && <CircularLoader />}

                {!isTabContentLoading && (
                  <>
                    <TabContent value={TAB_ID_STATS}>
                      <StatsTabContent />
                    </TabContent>

                    {!selectedRace.isBasicRanking && (
                      <TabContent value={TAB_ID_SPLIT}>
                        <SplitTabContent />
                      </TabContent>
                    )}
                  </>
                )}
              </Tabs>
            </runnerDetailsViewContext.Provider>
          )}
        </Card>
      )}
    </Page>
  );
}
