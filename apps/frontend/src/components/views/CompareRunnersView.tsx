import React from "react";
import type { RaceDict, RaceWithEdition } from "@live24hisere/core/types";
import { useGetPublicEditions } from "../../hooks/api/requests/public/editions/useGetPublicEditions";
import { useGetPublicRaces } from "../../hooks/api/requests/public/races/useGetPublicRaces";
import { useGetPublicRunners } from "../../hooks/api/requests/public/runners/useGetPublicRunners";
import { Card } from "../ui/Card";
import Page from "../ui/Page";
import RaceRunnerSelector from "../viewParts/compareRunners/RaceRunnerSelector";

export default function CompareRunnersView(): React.ReactElement {
  const getEditionsQuery = useGetPublicEditions();
  const editions = getEditionsQuery.data?.editions;

  const getRacesQuery = useGetPublicRaces();
  const races = getRacesQuery.data?.races;

  const getRunnersQuery = useGetPublicRunners();
  const runners = getRunnersQuery.data?.runners;

  const runnerWithAtLeastOneRace = React.useMemo(() => runners?.filter((r) => r.raceCount > 0), [runners]);

  const racesDict = React.useMemo(() => {
    if (!editions || !races) {
      return undefined;
    }

    const dict: RaceDict<RaceWithEdition> = {};

    for (const race of races) {
      const edition = editions.find((e) => e.id === race.editionId);

      if (!edition) {
        continue;
      }

      dict[race.id] = {
        ...race,
        edition,
      };
    }

    return dict;
  }, [editions, races]);

  return (
    <Page id="compare-runners" title="Comparaison de coureurs" htmlTitle="Comparaison de coureurs" layout="flexGap">
      <Card>
        <p>
          Vous pouvez utiliser cet outil pour comparer plusieurs coureurs différents, ou un même coureur sur plusieurs
          courses différentes.
        </p>

        <RaceRunnerSelector races={racesDict} runners={runnerWithAtLeastOneRace} alreadySelected={new Map()} />
      </Card>
    </Page>
  );
}
