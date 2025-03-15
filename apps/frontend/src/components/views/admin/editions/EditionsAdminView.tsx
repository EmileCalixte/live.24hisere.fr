import React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AdminEditionWithRaceAndRunnerCount } from "@live24hisere/core/types";
import { useGetAdminEditions } from "../../../../hooks/api/requests/admin/editions/useGetAdminEditions";
import { usePutAdminEditionOrder } from "../../../../hooks/api/requests/admin/editions/usePutAdminEditionOrder";
import { getEditionsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import SortListButtons from "../../../ui/buttons/SortListButtons";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { Link } from "../../../ui/Link";
import SortList from "../../../ui/lists/SortList";
import Page from "../../../ui/Page";
import EditionListItem from "../../../viewParts/admin/editions/EditionListItem";

export default function EditionsAdminView(): React.ReactElement {
  const getEditionsQuery = useGetAdminEditions();

  const editions = getEditionsQuery.data?.editions;

  const putEditionOrderMutation = usePutAdminEditionOrder();

  // Used when user is reordering the list
  const [sortingEditions, setSortingEditions] = React.useState<AdminEditionWithRaceAndRunnerCount[] | false>(false);
  const [isSorting, setIsSorting] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setSortingEditions(editions ?? []);
  }, [editions]);

  function saveSort(): void {
    if (!sortingEditions) {
      return;
    }

    setIsSaving(true);

    const editionIds = sortingEditions.map((edition) => edition.id);

    putEditionOrderMutation.mutate(editionIds, {
      onSettled: () => {
        void getEditionsQuery.refetch().finally(() => {
          setIsSaving(false);
          setIsSorting(false);
        });
      },
    });
  }

  return (
    <Page
      id="admin-editions"
      htmlTitle="Éditions"
      title={
        <span className="flex flex-wrap items-center gap-5">
          Éditions
          <span className="text-base">
            <Link to="/admin/editions/create" variant="button" icon={<FontAwesomeIcon icon={faPlus} />}>
              Créer
            </Link>
          </span>
        </span>
      }
      breadCrumbs={getEditionsBreadcrumbs()}
    >
      {getEditionsQuery.isLoading && <CircularLoader />}

      {editions && (
        <Card>
          {editions.length === 0 && <p>Aucune édition</p>}

          {editions.length > 0 && (
            <div className="flex flex-col gap-3">
              <p>Les éditions seront ordonnées dans le même ordre que celui visible ici.</p>

              <SortListButtons
                isSorting={isSorting}
                setIsSorting={setIsSorting}
                saveSort={saveSort}
                disabled={isSaving}
              />

              <div>
                <SortList
                  items={sortingEditions || []}
                  keyFunction={(edition) => edition.id}
                  setItems={setSortingEditions}
                  isSorting={isSorting}
                >
                  {(edition, isDragged, isDraggedOver) => (
                    <EditionListItem
                      edition={edition}
                      isSorting={isSorting}
                      isDragged={isDragged}
                      isDraggedOver={isDraggedOver}
                    />
                  )}
                </SortList>
              </div>
            </div>
          )}
        </Card>
      )}
    </Page>
  );
}
