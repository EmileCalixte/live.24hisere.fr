import React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { AdminEditionWithRaceCount } from "@live24hisere/core/types";
import { useGetAdminEditions } from "../../../../hooks/api/requests/admin/editions/useGetAdminEditions";
import { usePutAdminEditionOrder } from "../../../../hooks/api/requests/admin/editions/usePutAdminEditionOrder";
import { getEditionsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import SortListButtons from "../../../ui/buttons/SortListButtons";
import CircularLoader from "../../../ui/CircularLoader";
import SortList from "../../../ui/lists/SortList";
import Page from "../../../ui/Page";
import EditionListItem from "../../../viewParts/admin/editions/EditionListItem";

export default function EditionsAdminView(): React.ReactElement {
  const getEditionsQuery = useGetAdminEditions();

  const editions = getEditionsQuery.data?.editions;

  const putEditionOrderMutation = usePutAdminEditionOrder();

  // Used when user is reordering the list
  const [sortingEditions, setSortingEditions] = React.useState<AdminEditionWithRaceCount[] | false>(false);
  const [isSorting, setIsSorting] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setSortingEditions(editions ?? []);
  }, [editions]);

  const saveSort = (): void => {
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
  };

  return (
    <Page id="admin-editions" title="Éditions">
      <Row>
        <Col>{getEditionsBreadcrumbs()}</Col>
      </Row>

      {getEditionsQuery.isLoading && <CircularLoader />}

      {editions && (
        <>
          <Row>
            <Col>
              <Link to="/admin/editions/create" className="button">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Créer une édition
              </Link>
            </Col>
          </Row>

          <Row>
            <Col>
              {editions.length === 0 && <p>Aucune édition</p>}

              {editions.length > 0 && (
                <>
                  <SortListButtons
                    isSorting={isSorting}
                    setIsSorting={setIsSorting}
                    saveSort={saveSort}
                    disabled={isSaving}
                    className="mt-4"
                  />

                  <Row>
                    <Col>
                      <SortList
                        items={sortingEditions || []}
                        keyFunction={(edition) => edition.id}
                        setItems={setSortingEditions}
                        isSorting={isSorting}
                        className="admin-list"
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
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </>
      )}
    </Page>
  );
}
