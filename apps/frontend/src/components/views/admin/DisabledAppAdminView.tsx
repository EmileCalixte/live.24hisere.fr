import React from "react";
import DOMPurify from "dompurify";
import { Col, Row } from "react-bootstrap";
import { useGetDisabledAppData } from "../../../hooks/api/requests/admin/config/useGetDisabledAppData";
import { usePatchDisabledAppData } from "../../../hooks/api/requests/admin/config/usePatchDisabledAppData";
import { getDisabledAppBreadcrumbs } from "../../../services/breadcrumbs/breadcrumbService";
import { appContext } from "../../App";
import { Checkbox } from "../../ui/forms/Checkbox";
import { TextArea } from "../../ui/forms/TextArea";
import Page from "../../ui/Page";

export default function DisabledAppAdminView(): React.ReactElement {
  const {
    appData: { setIsAppEnabled: setAppDataIsAppEnabled },
  } = React.useContext(appContext);

  const getDisabledAppDataQuery = useGetDisabledAppData();
  const disabledAppData = getDisabledAppDataQuery.data;

  const patchDisabledAppDataMutation = usePatchDisabledAppData(getDisabledAppDataQuery.refetch);

  const [isAppEnabled, setIsAppEnabled] = React.useState(false);
  const [disabledAppMessage, setDisabledAppMessage] = React.useState("");

  const unsavedChanges = React.useMemo(() => {
    if (!disabledAppData) {
      return false;
    }

    return [
      isAppEnabled === disabledAppData.isAppEnabled,
      disabledAppMessage === disabledAppData.disabledAppMessage,
    ].includes(false);
  }, [disabledAppData, disabledAppMessage, isAppEnabled]);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    const body = {
      isAppEnabled,
      disabledAppMessage,
    };

    patchDisabledAppDataMutation.mutate(body);
  };

  React.useEffect(() => {
    if (!disabledAppData) {
      return;
    }

    setIsAppEnabled(disabledAppData.isAppEnabled);
    setAppDataIsAppEnabled(disabledAppData.isAppEnabled);
    setDisabledAppMessage(disabledAppData.disabledAppMessage ?? "");
  }, [disabledAppData, setAppDataIsAppEnabled]);

  return (
    <Page id="admin-disabled-app" title="Accès à l'application">
      <Row>
        <Col>{getDisabledAppBreadcrumbs()}</Col>
      </Row>

      <Row>
        <Col>
          <form onSubmit={onSubmit}>
            <Checkbox
              label="Application active"
              checked={isAppEnabled}
              onChange={(e) => {
                setIsAppEnabled(e.target.checked);
              }}
            />

            <TextArea
              label="Message affiché si application non active"
              value={disabledAppMessage}
              onChange={(e) => {
                setDisabledAppMessage(e.target.value);
              }}
              className="mt-3"
            />

            <button
              className="button mt-3"
              type="submit"
              disabled={getDisabledAppDataQuery.isPending || patchDisabledAppDataMutation.isPending || !unsavedChanges}
            >
              Enregistrer
            </button>
          </form>
        </Col>
      </Row>

      {disabledAppMessage && (
        <Row>
          <Col>
            <p>Aperçu :</p>

            <div
              className="card"
              id="disabled-app-message-preview"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(disabledAppMessage),
              }}
            />
          </Col>
        </Row>
      )}
    </Page>
  );
}
