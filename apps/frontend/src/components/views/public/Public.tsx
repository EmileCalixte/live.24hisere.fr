import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import type { EditionWithRaceCount } from "@live24hisere/core/types";
import { usePublicEditions } from "../../../hooks/api/usePublicEditions";
import { useSelectedEdition } from "../../../hooks/useSelectedEdition";
import CircularLoader from "../../ui/CircularLoader";
import EditionSelectorCard from "../../viewParts/EditionSelectorCard";
import RankingView from "../RankingView";
import RunnerDetailsView from "../RunnerDetailsView";

interface PublicContext {
  selectedEdition: EditionWithRaceCount | null;
}

export const publicContext = React.createContext<PublicContext>({
  selectedEdition: null,
});

export default function Public(): React.ReactElement {
  // const editions = useIntervalSimpleApiRequest(getEditions).json?.editions;

  const result = usePublicEditions();

  console.log("RESULT", JSON.parse(JSON.stringify(result)), result.error);

  const editions = result.data?.editions;

  const { selectedEdition, setSelectedEditionId } = useSelectedEdition(editions);

  const canSelectEdition = !!editions && editions.length >= 2;

  const onEditionSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedEditionId(parseInt(e.target.value));
  };

  if (editions === undefined) {
    return <CircularLoader />;
  }

  return (
    <>
      {canSelectEdition && (
        <EditionSelectorCard
          editions={editions}
          selectedEditionId={selectedEdition?.id}
          onEditionSelect={onEditionSelect}
          className="mt-3"
        />
      )}

      <publicContext.Provider value={{ selectedEdition }}>
        <Routes>
          <Route path="/ranking" element={<RankingView />} />
          <Route path="/runner-details" element={<RunnerDetailsView />} />
          <Route path="/runner-details/:runnerId" element={<RunnerDetailsView />} />

          {/* Redirect any unresolved route to /ranking */}
          <Route path="*" element={<Navigate to="/ranking" replace />} />
        </Routes>
      </publicContext.Provider>
    </>
  );
}
