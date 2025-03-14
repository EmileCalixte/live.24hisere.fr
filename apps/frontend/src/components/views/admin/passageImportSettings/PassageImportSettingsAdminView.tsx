import React from "react";
import { stringUtils } from "@live24hisere/utils";
import { useGetPassageImportSettings } from "../../../../hooks/api/requests/admin/config/useGetPassageImportSettings";
import { usePatchPassageImportSettings } from "../../../../hooks/api/requests/admin/config/usePatchPassageImportSettings";
import { getImportPassagesSettingsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { Card } from "../../../ui/Card";
import { Button } from "../../../ui/forms/Button";
import { Input } from "../../../ui/forms/Input";
import Page from "../../../ui/Page";

export default function PassageImportSettingsAdminView(): React.ReactElement {
  const getPassageImportSettingsQuery = useGetPassageImportSettings();
  const passageImportSettings = getPassageImportSettingsQuery.data;

  const patchPassageImportSettingsMutation = usePatchPassageImportSettings();

  const [dagFileUrl, setDagFileUrl] = React.useState("");

  const unsavedChanges = React.useMemo(() => {
    if (!passageImportSettings) {
      return false;
    }

    return dagFileUrl !== passageImportSettings.dagFileUrl;
  }, [dagFileUrl, passageImportSettings]);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    const body = {
      dagFileUrl: dagFileUrl || null,
    };

    patchPassageImportSettingsMutation.mutate(body, {
      onSuccess: () => {
        void getPassageImportSettingsQuery.refetch();
      },
    });
  };

  React.useEffect(() => {
    if (!passageImportSettings) {
      return;
    }

    setDagFileUrl(passageImportSettings.dagFileUrl ?? "");
  }, [passageImportSettings]);

  const isDagFileUrlValid = !dagFileUrl || stringUtils.isValidUrl(dagFileUrl);

  return (
    <Page
      id="admin-passage-import-settings"
      htmlTitle="Paramètres d'import des passages"
      title="Paramètres d'import des passages"
      breadCrumbs={getImportPassagesSettingsBreadcrumbs()}
    >
      <Card>
        <div className="w-full md:w-1/2 xl:w-1/4">
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <Input
              label="URL du fichier DAG à importer"
              value={dagFileUrl}
              onChange={(e) => {
                setDagFileUrl(e.target.value.trim());
              }}
              hasError={!isDagFileUrlValid}
            />

            <div>
              <Button
                type="submit"
                disabled={
                  getPassageImportSettingsQuery.isPending
                  || patchPassageImportSettingsMutation.isPending
                  || !unsavedChanges
                  || !isDagFileUrlValid
                }
              >
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </Page>
  );
}
