import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router-dom";
import type { EditionWithRaceCount } from "@live24hisere/core/types";
import { ApiError } from "../../../errors/ApiError";
import { ApiTimeoutError } from "../../../errors/ApiTimeoutError";
import { useSelectedEdition } from "../../../hooks/useSelectedEdition";
import { getEditions } from "../../../services/api/editionService";
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

  const result = useQuery({
    queryKey: ["editions"],
    queryFn: getEditions,
    refetchInterval: 20000,
    retry: false,
  });

  console.log("RESULT", JSON.parse(JSON.stringify(result)), result.error);

  if (result.error instanceof ApiError) {
    console.error("ERROR HTTP STATUS", result.error);
  } else if (result.error instanceof ApiTimeoutError) {
    console.error("REQUEST TIMEOUT", result.error);
  } else if (result.error !== null) {
    console.error("ANY OTHER ERROR", result.error);
  }

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
