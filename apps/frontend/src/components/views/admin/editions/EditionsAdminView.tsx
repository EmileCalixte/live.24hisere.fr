import React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { AdminEditionWithRaceCount } from "@live24hisere/core/types";
import { getAdminEditions, putAdminEditionOrder } from "../../../../services/api/editionService";
import { getEditionsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import SortListButtons from "../../../ui/buttons/SortListButtons";
import CircularLoader from "../../../ui/CircularLoader";
import SortList from "../../../ui/lists/SortList";
import Page from "../../../ui/Page";
import EditionListItem from "../../../viewParts/admin/editions/EditionListItem";

export default function EditionsAdminView(): React.ReactElement {
  const { accessToken } = React.useContext(appContext).user;

  // false = not fetched yet
  const [editions, setEditions] = React.useState<AdminEditionWithRaceCount[] | false>(false);

  // Used when user is reordering the list
  const [sortingEditions, setSortingEditions] = React.useState<AdminEditionWithRaceCount[] | false>(false);
  const [isSorting, setIsSorting] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);

  const fetchEditions = React.useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminEditions(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des éditions");
      return;
    }

    setEditions(result.json.editions);
    setSortingEditions(result.json.editions);
  }, [accessToken]);

  const saveSort = React.useCallback(async () => {
    if (!accessToken || !sortingEditions) {
      return;
    }

    setIsSaving(true);

    const editionIds = sortingEditions.map((edition) => edition.id);

    const result = await putAdminEditionOrder(accessToken, editionIds);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de sauvegarder l'ordre des éditions");
      setIsSaving(false);
      return;
    }

    setEditions([...sortingEditions]);

    ToastService.getToastr().success("L'ordre des éditions a été modifié");
    setIsSorting(false);
    setIsSaving(false);
  }, [accessToken, sortingEditions]);

  React.useEffect(() => {
    void fetchEditions();
  }, [fetchEditions]);

  return (
    <Page id="admin-editions" title="Éditions">
      <Row>
        <Col>{getEditionsBreadcrumbs()}</Col>
      </Row>

      {editions === false && <CircularLoader />}

      {editions !== false && (
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
                    saveSort={() => {
                      void saveSort();
                    }}
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
