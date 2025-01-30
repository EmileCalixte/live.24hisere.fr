import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import type { EditionWithRaceCount } from "@live24hisere/core/types";
import { useGetPublicEditions } from "../../../hooks/api/requests/public/editions/useGetPublicEditions";
import { useSelectedEdition } from "../../../hooks/useSelectedEdition";
import CircularLoader from "../../ui/CircularLoader";
import EditionSelectorCard from "../../viewParts/EditionSelectorCard";

const RankingView = React.lazy(async () => await import("../RankingView"));
const RunnerDetailsView = React.lazy(async () => await import("../RunnerDetailsView"));

interface PublicContext {
  selectedEdition: EditionWithRaceCount | null;
}

export const publicContext = React.createContext<PublicContext>({
  selectedEdition: null,
});

export default function Public(): React.ReactElement {
  const getEditionsQuery = useGetPublicEditions();

  const editions = getEditionsQuery.data?.editions;

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
          <Route
            path="/ranking"
            element={
              <React.Suspense fallback={<CircularLoader />}>
                <RankingView />
              </React.Suspense>
            }
          />
          <Route
            path="/runner-details"
            element={
              <React.Suspense fallback={<CircularLoader />}>
                <RunnerDetailsView />
              </React.Suspense>
            }
          />
          <Route path="/runner-details/:runnerId" element={<RunnerDetailsView />} />

          {/* Redirect any unresolved route to /ranking */}
          <Route path="*" element={<Navigate to="/ranking" replace />} />
        </Routes>
      </publicContext.Provider>
    </>
  );
}
