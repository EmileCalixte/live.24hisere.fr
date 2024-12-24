import React from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import type { PublicEdition } from "@live24hisere/core/types";
import { appContext } from "../components/App";
import { SearchParam } from "../constants/searchParams";
import type { ReactStateSetter } from "../types/utils/react";

interface UseSelectedEdition<TEdition extends PublicEdition> {
  selectedEdition: TEdition | null;
  setSelectedEditionId: ReactStateSetter<number | null>;
}

export function useSelectedEdition<TEdition extends PublicEdition>(
  editions: TEdition[] | undefined,
): UseSelectedEdition<TEdition> {
  const {
    appData: { currentEditionId },
  } = React.useContext(appContext);
  const multipleEditions = !!editions && editions.length >= 2;

  const [selectedEditionId, setSelectedEditionId] = React.useState<number | null>(null);
  const [selectedEditionIdParam, setSelectedEditionIdParam] = useQueryState(SearchParam.EDITION, parseAsInteger);

  const previousHref = React.useRef(window.location.href);

  // Initialize
  React.useEffect(() => {
    if (selectedEditionId === null && editions) {
      if (!multipleEditions) {
        setSelectedEditionId(editions[0]?.id ?? null);
        return;
      }

      if (selectedEditionIdParam !== null) {
        setSelectedEditionId(selectedEditionIdParam);
        return;
      }

      if (currentEditionId !== null) {
        setSelectedEditionId(currentEditionId);
      }
    }
  }, [currentEditionId, editions, multipleEditions, selectedEditionId, selectedEditionIdParam]);

  // Update query string param when selected edition ID is updated
  React.useEffect(() => {
    if (selectedEditionId !== null && selectedEditionId !== selectedEditionIdParam) {
      void setSelectedEditionIdParam(selectedEditionId);
    }
  }, [selectedEditionId, selectedEditionIdParam, setSelectedEditionIdParam]);

  const selectedEdition = React.useMemo(
    () => editions?.find((edition) => edition.id === selectedEditionId) ?? null,
    [editions, selectedEditionId],
  );

  // Hack to rewrite edition param after a navigation
  if (previousHref.current !== window.location.href) {
    void setSelectedEditionIdParam(selectedEditionId);
    previousHref.current = window.location.href;
  }

  return {
    selectedEdition,
    setSelectedEditionId,
  };
}
