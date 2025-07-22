import React from "react";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import type { EditionWithRaceCount, RaceWithRunnerCount } from "@live24hisere/core/types";
import { arrayUtils } from "@live24hisere/utils";
import { TrackedEvent } from "../../constants/eventTracking/customEventNames";
import { SearchParam } from "../../constants/searchParams";
import { racesViewContext, type RacesViewContext } from "../../contexts/RacesViewContext";
import { useGetPublicEditions } from "../../hooks/api/requests/public/editions/useGetPublicEditions";
import { useGetPublicEditionRaces } from "../../hooks/api/requests/public/races/useGetPublicEditionRaces";
import { useEditionSelectOptions } from "../../hooks/useEditionSelectOptions";
import { useRaceSelectOptions } from "../../hooks/useRaceSelectOptions";
import { trackEvent } from "../../utils/eventTracking/eventTrackingUtils";
import { Card } from "../ui/Card";
import Select from "../ui/forms/Select";
import Page from "../ui/Page";
import { Tab, TabContent, TabList, Tabs } from "../ui/Tabs";
import { RankingTabContent } from "../viewParts/races/ranking/RankingTabContent";
import { StatsTabContent } from "../viewParts/races/stats/StatsTabContent";

const TAB_RANKING = "ranking";
const TAB_STATS = "stats";

const TABS = [TAB_RANKING, TAB_STATS] as const;

type Tab = (typeof TABS)[number];

export default function RacesView(): React.ReactElement {
  const [selectedEditionId, setSelectedEditionId] = useQueryState(SearchParam.EDITION, parseAsInteger);
  const [selectedRaceId, setSelectedRaceId] = useQueryState(SearchParam.RACE, parseAsInteger);
  const [selectedTab, setSelectedTab] = useQueryState(SearchParam.TAB, parseAsStringLiteral(TABS));

  const getEditionsQuery = useGetPublicEditions();
  const editions = getEditionsQuery.data?.editions;

  const selectedEdition = React.useMemo<EditionWithRaceCount | null>(
    () => editions?.find((edition) => edition.id === selectedEditionId) ?? null,
    [editions, selectedEditionId],
  );

  const getRacesQuery = useGetPublicEditionRaces(selectedEdition?.id);
  const races = getRacesQuery.data?.races;

  const selectedRace = React.useMemo<RaceWithRunnerCount | null>(
    () => races?.find((race) => race.id === selectedRaceId) ?? null,
    [races, selectedRaceId],
  );

  const editionOptions = useEditionSelectOptions(editions);
  const raceOptions = useRaceSelectOptions(races);

  const onEditionSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const editionId = parseInt(e.target.value);

    trackEvent(TrackedEvent.CHANGE_EDITION, { editionId });

    void setSelectedEditionId(editionId);
  };

  const onRaceSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const raceId = parseInt(e.target.value);

    trackEvent(TrackedEvent.CHANGE_RACE, { raceId });

    void setSelectedRaceId(raceId);
  };

  function onTabSelect(tab: Tab): void {
    trackEvent(TrackedEvent.RACES_VIEW_CHANGE_TAB, { tab });

    void setSelectedTab(tab);
  }

  // Set default tab (we don't use nuqs `withDefault` because we always want the tab to be displayed in params)
  React.useEffect(() => {
    if (!arrayUtils.inArray(selectedTab, TABS)) {
      void setSelectedTab(TAB_RANKING);
    }
  }, [selectedTab, setSelectedTab]);

  // Auto-select the first edition
  React.useEffect(() => {
    if (editions && editions.length > 0 && selectedEdition === null) {
      void setSelectedEditionId(editions[0].id);
    }
  }, [editions, selectedEdition, setSelectedEditionId]);

  // Auto-select the first race in the selected edition
  React.useEffect(() => {
    if (races && races.length > 0 && selectedRace === null) {
      void setSelectedRaceId(races[0].id);
    }
  }, [races, selectedRace, setSelectedRaceId]);

  const htmlTitle = (function (): string {
    if (!selectedRace || !selectedEdition) {
      return "Courses";
    }

    return `${selectedRace.name} (${selectedEdition.name})`;
  })();

  const racesViewContextValues: RacesViewContext = { selectedEdition, selectedRace };

  return (
    <Page id="ranking" htmlTitle={htmlTitle} contentClassName="flex flex-col gap-3">
      {editions && editions.length < 1 && <p>Aucune donnée disponible.</p>}

      <Card className="grid-rows-auto grid grid-cols-6 gap-3 print:hidden">
        {editions && editions.length >= 2 && (
          <Select
            className="col-span-full sm:col-span-4 md:col-span-3 lg:col-span-2 2xl:col-span-1"
            label="Édition"
            options={editionOptions}
            onChange={onEditionSelect}
            value={selectedEdition ? selectedEdition.id : undefined}
            placeholderLabel="Sélectionnez une édition"
          />
        )}
        {selectedEdition && (
          <Select
            className="col-span-full sm:col-span-4 md:col-span-3 lg:col-span-2 2xl:col-span-1"
            label="Course"
            options={raceOptions}
            onChange={onRaceSelect}
            value={selectedRace ? selectedRace.id : undefined}
            placeholderLabel="Sélectionnez une course"
          />
        )}
      </Card>

      {selectedRace && (
        <racesViewContext.Provider value={racesViewContextValues}>
          <Tabs
            value={selectedTab}
            onValueChange={(newValue: Tab) => {
              onTabSelect(newValue);
            }}
            className="flex flex-col gap-3"
          >
            <div>
              <TabList>
                <Tab value={TAB_RANKING}>Classement</Tab>
                <Tab value={TAB_STATS}>Statistiques</Tab>
              </TabList>
            </div>

            <TabContent value={TAB_RANKING}>
              <RankingTabContent />
            </TabContent>

            <TabContent value={TAB_STATS}>
              <StatsTabContent />
            </TabContent>
          </Tabs>
        </racesViewContext.Provider>
      )}
    </Page>
  );
}
