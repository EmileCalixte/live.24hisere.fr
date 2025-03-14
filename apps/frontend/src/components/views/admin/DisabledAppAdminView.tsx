import React from "react";
import DOMPurify from "dompurify";
import { appContext } from "../../../contexts/AppContext";
import { useGetDisabledAppData } from "../../../hooks/api/requests/admin/config/useGetDisabledAppData";
import { usePatchDisabledAppData } from "../../../hooks/api/requests/admin/config/usePatchDisabledAppData";
import { getDisabledAppBreadcrumbs } from "../../../services/breadcrumbs/breadcrumbService";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/forms/Button";
import { Checkbox } from "../../ui/forms/Checkbox";
import { TextArea } from "../../ui/forms/TextArea";
import Page from "../../ui/Page";
import { Separator } from "../../ui/Separator";

export default function DisabledAppAdminView(): React.ReactElement {
  const {
    appData: { setIsAppEnabled: setAppDataIsAppEnabled },
  } = React.useContext(appContext);

  const getDisabledAppDataQuery = useGetDisabledAppData();
  const disabledAppData = getDisabledAppDataQuery.data;

  const patchDisabledAppDataMutation = usePatchDisabledAppData();

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

    patchDisabledAppDataMutation.mutate(body, {
      onSuccess: () => {
        void getDisabledAppDataQuery.refetch();
      },
    });
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
    <Page
      id="admin-disabled-app"
      htmlTitle="Accès à l'application"
      title="Accès à l'application"
      breadCrumbs={getDisabledAppBreadcrumbs()}
    >
      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
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
          />

          <div>
            <Button
              type="submit"
              disabled={getDisabledAppDataQuery.isPending || patchDisabledAppDataMutation.isPending || !unsavedChanges}
            >
              Enregistrer
            </Button>
          </div>
        </form>

        {disabledAppMessage && (
          <>
            <Separator className="my-5" />

            <div className="flex flex-col gap-3">
              <p>Aperçu :</p>

              <Card>
                <div
                  id="disabled-app-message-preview"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(disabledAppMessage),
                  }}
                ></div>
              </Card>
            </div>
          </>
        )}
      </Card>
    </Page>
  );
}
