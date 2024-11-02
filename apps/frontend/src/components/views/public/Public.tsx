import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { type EditionWithRaceCount } from "@live24hisere/core/types";
import { useIntervalApiRequest } from "../../../hooks/useIntervalApiRequest";
import { getEditions } from "../../../services/api/editionService";
import CircularLoader from "../../ui/CircularLoader";
import EditionSelectorCard from "../../viewParts/EditionSelectorCard";
import RankingView from "../RankingView";
import RunnerDetailsView from "../RunnerDetailsView";

export default function Public(): React.ReactElement {
  const editions = useIntervalApiRequest(getEditions).json?.editions;

  const selectedEdition = React.useMemo<EditionWithRaceCount | null | undefined>(() => {
    if (editions) {
      // TODO
      return editions[0];
    }
  }, [editions]);

  const showEditionSelector = !!editions && editions.length >= 2;

  if (editions === undefined) {
    return <CircularLoader />;
  }

  return (
    <>
      {showEditionSelector && (
        <EditionSelectorCard editions={editions} selectedEditionId={selectedEdition?.id} className="mt-3" />
      )}

      <Routes>
        {selectedEdition && (
          <>
            <Route path="/ranking" element={<RankingView />} />
            <Route path="/runner-details" element={<RunnerDetailsView />} />
            <Route path="/runner-details/:runnerId" element={<RunnerDetailsView />} />
          </>
        )}

        {/* Redirect any unresolved route to /ranking */}
        <Route path="*" element={<Navigate to="/ranking" replace />} />
      </Routes>
    </>
  );
}
