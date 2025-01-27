import React from "react";
import { Col, Row } from "react-bootstrap";
import { stringUtils } from "@live24hisere/utils";
import { useGetPassageImportSettings } from "../../../../hooks/api/requests/admin/config/useGetPassageImportSettings";
import { usePatchPassageImportSettings } from "../../../../hooks/api/requests/admin/config/usePatchPassageImportSettings";
import { getImportPassagesSettingsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { Input } from "../../../ui/forms/Input";
import Page from "../../../ui/Page";

export default function PassageImportSettingsAdminView(): React.ReactElement {
  const getPassageImportSettingsQuery = useGetPassageImportSettings();
  const passageImportSettings = getPassageImportSettingsQuery.data;

  const patchPassageImportSettingsMutation = usePatchPassageImportSettings(getPassageImportSettingsQuery.refetch);

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

    patchPassageImportSettingsMutation.mutate(body);
  };

  React.useEffect(() => {
    if (!passageImportSettings) {
      return;
    }

    setDagFileUrl(passageImportSettings.dagFileUrl ?? "");
  }, [passageImportSettings]);

  const isDagFileUrlValid = !dagFileUrl || stringUtils.isValidUrl(dagFileUrl);

  return (
    <Page id="admin-passage-import-settings" title="Paramètres d'import des passages">
      <Row>
        <Col>{getImportPassagesSettingsBreadcrumbs()}</Col>
      </Row>

      <Row>
        <Col lg={6} md={9} sm={12}>
          <form onSubmit={onSubmit}>
            <Input
              label="URL du fichier DAG à importer"
              value={dagFileUrl}
              onChange={(e) => {
                setDagFileUrl(e.target.value.trim());
              }}
              hasError={!isDagFileUrlValid}
            />

            <button
              className="button mt-3"
              type="submit"
              disabled={
                getPassageImportSettingsQuery.isPending ||
                patchPassageImportSettingsMutation.isPending ||
                !unsavedChanges ||
                !isDagFileUrlValid
              }
            >
              Enregistrer
            </button>
          </form>
        </Col>
      </Row>
    </Page>
  );
}
