import React from "react";
import DOMPurify from "dompurify";
import { useGetGlobalInformationMessageData } from "../../../hooks/api/requests/admin/config/useGetGlobalInformationMessageData";
import { usePatchGlobalInformationMessageData } from "../../../hooks/api/requests/admin/config/usePatchGlobalInformationMessageData";
import { getGlobalInformationMessageBreadcrumbs } from "../../../services/breadcrumbs/breadcrumbService";
import type { FormSubmitEventHandler } from "../../../types/utils/react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/forms/Button";
import { Checkbox } from "../../ui/forms/Checkbox";
import { TextArea } from "../../ui/forms/TextArea";
import Page from "../../ui/Page";
import { Separator } from "../../ui/Separator";

export default function GlobalInformationMessageAdminView(): React.ReactElement {
  const getGlobalInformationMessageDataQuery = useGetGlobalInformationMessageData();
  const globalInformationMessageData = getGlobalInformationMessageDataQuery.data;

  const patchGlobalInformationMessageDataMutation = usePatchGlobalInformationMessageData();

  const [isGlobalInformationMessageVisible, setIsGlobalInformationMessageVisible] = React.useState(false);
  const [globalInformationMessage, setGlobalInformationMessage] = React.useState("");

  const unsavedChanges = React.useMemo(() => {
    if (!globalInformationMessageData) {
      return false;
    }

    return [
      isGlobalInformationMessageVisible === globalInformationMessageData.isGlobalInformationMessageVisible,
      globalInformationMessage === globalInformationMessageData.globalInformationMessage,
    ].includes(false);
  }, [globalInformationMessageData, globalInformationMessage, isGlobalInformationMessageVisible]);

  const onSubmit: FormSubmitEventHandler = (e) => {
    e.preventDefault();

    const body = {
      isGlobalInformationMessageVisible,
      globalInformationMessage,
    };

    patchGlobalInformationMessageDataMutation.mutate(body, {
      onSuccess: () => {
        void getGlobalInformationMessageDataQuery.refetch();
      },
    });
  };

  React.useEffect(() => {
    if (!globalInformationMessageData) {
      return;
    }

    setIsGlobalInformationMessageVisible(globalInformationMessageData.isGlobalInformationMessageVisible);
    setGlobalInformationMessage(globalInformationMessageData.globalInformationMessage ?? "");
  }, [globalInformationMessageData]);

  return (
    <Page
      id="admin-global-information-message"
      htmlTitle="Message d'information global"
      title="Message d'information global"
      breadCrumbs={getGlobalInformationMessageBreadcrumbs()}
    >
      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <Checkbox
            label="Message visible"
            checked={isGlobalInformationMessageVisible}
            onChange={(e) => {
              setIsGlobalInformationMessageVisible(e.target.checked);
            }}
          />

          <TextArea
            label="Message affiché en haut de l'application"
            value={globalInformationMessage}
            onChange={(e) => {
              setGlobalInformationMessage(e.target.value);
            }}
          />

          <div>
            <Button
              type="submit"
              disabled={
                getGlobalInformationMessageDataQuery.isPending
                || patchGlobalInformationMessageDataMutation.isPending
                || !unsavedChanges
              }
            >
              Enregistrer
            </Button>
          </div>
        </form>

        {globalInformationMessage && (
          <>
            <Separator className="my-5" />

            <div className="flex flex-col gap-3">
              <p>Aperçu :</p>

              <Card>
                <div
                  id="global-information-message-preview"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(globalInformationMessage),
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
