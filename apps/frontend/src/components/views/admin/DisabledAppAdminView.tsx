import React from "react";
import DOMPurify from "dompurify";
import { Col, Row } from "react-bootstrap";
import { type DisabledAppData } from "@live24hisere/core/types";
import { getDisabledAppData, patchDisabledAppData } from "../../../services/api/configService";
import ToastService from "../../../services/ToastService";
import { isApiRequestResultOk } from "../../../utils/apiUtils";
import { appContext } from "../../App";
import Breadcrumbs from "../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../ui/breadcrumbs/Crumb";
import { Checkbox } from "../../ui/forms/Checkbox";
import { TextArea } from "../../ui/forms/TextArea";
import Page from "../../ui/Page";

export default function DisabledAppAdminView(): React.ReactElement {
  const {
    user: { accessToken },
    appData: { setIsAppEnabled: setAppDataIsAppEnabled },
  } = React.useContext(appContext);

  const [disabledAppData, setDisabledAppData] = React.useState<DisabledAppData | false>(false);

  const [isAppEnabled, setIsAppEnabled] = React.useState(false);
  const [disabledAppMessage, setDisabledAppMessage] = React.useState("");

  const [isSaving, setIsSaving] = React.useState(false);

  const unsavedChanges = React.useMemo(() => {
    if (!disabledAppData) {
      return false;
    }

    return [
      isAppEnabled === disabledAppData.isAppEnabled,
      disabledAppMessage === disabledAppData.disabledAppMessage,
    ].includes(false);
  }, [disabledAppData, disabledAppMessage, isAppEnabled]);

  const fetchDisabledAppData = React.useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getDisabledAppData(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer les données d'accès à l'application");
      return;
    }

    setDisabledAppData(result.json);
  }, [accessToken]);

  React.useEffect(() => {
    void fetchDisabledAppData();
  }, [fetchDisabledAppData]);

  const onSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!accessToken) {
        return;
      }

      setIsSaving(true);

      const body = {
        isAppEnabled,
        disabledAppMessage,
      };

      const result = await patchDisabledAppData(accessToken, body);

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        setIsSaving(false);
        return;
      }

      ToastService.getToastr().success("Paramètres enregistrés");

      setDisabledAppData(result.json);
      setAppDataIsAppEnabled(result.json.isAppEnabled);
      setIsSaving(false);
    },
    [accessToken, disabledAppMessage, isAppEnabled, setAppDataIsAppEnabled],
  );

  React.useEffect(() => {
    if (!disabledAppData) {
      return;
    }

    setIsAppEnabled(disabledAppData.isAppEnabled);
    setDisabledAppMessage(disabledAppData.disabledAppMessage ?? "");
  }, [disabledAppData]);

  return (
    <Page id="admin-disabled-app" title="Accès à l'application">
      <Row>
        <Col>
          <Breadcrumbs>
            <Crumb url="/admin" label="Administration" />
            <Crumb label="Accès à l'application" />
          </Breadcrumbs>
        </Col>
      </Row>

      <Row>
        <Col>
          <form
            onSubmit={(e) => {
              void onSubmit(e);
            }}
          >
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

            <button className="button mt-3" type="submit" disabled={isSaving || !unsavedChanges}>
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
