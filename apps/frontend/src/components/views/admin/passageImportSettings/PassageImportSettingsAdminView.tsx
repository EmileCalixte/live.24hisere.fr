import React from "react";
import { Col, Row } from "react-bootstrap";
import { type PassageImportSettings } from "@live24hisere/core/types";
import { stringUtils } from "@live24hisere/utils";
import {
    getPassageImportSettings,
    patchPassageImportSettings,
} from "../../../../services/api/ConfigService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import Breadcrumbs from "../../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../../ui/breadcrumbs/Crumb";
import { Input } from "../../../ui/forms/Input";
import Page from "../../../ui/Page";

export default function PassageImportSettingsAdminView(): React.ReactElement {
    const {
        user: { accessToken },
    } = React.useContext(appContext);

    const [passageImportSettingsData, setPassageImportSettingsData] =
        React.useState<PassageImportSettings | false>(false);

    const [dagFileUrl, setDagFileUrl] = React.useState("");

    const [isSaving, setIsSaving] = React.useState(false);

    const unsavedChanges = React.useMemo(() => {
        if (!passageImportSettingsData) {
            return false;
        }

        return dagFileUrl !== passageImportSettingsData.dagFileUrl;
    }, [dagFileUrl, passageImportSettingsData]);

    const fetchPassageImportData = React.useCallback(async () => {
        if (!accessToken) {
            return;
        }

        const result = await getPassageImportSettings(accessToken);

        if (!isApiRequestResultOk(result)) {
            ToastService.getToastr().error(
                "Impossible de récupérer les paramètres d'import de passages",
            );
            return;
        }

        setPassageImportSettingsData(result.json);
    }, [accessToken]);

    React.useEffect(() => {
        void fetchPassageImportData();
    }, [fetchPassageImportData]);

    const onSubmit = React.useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!accessToken) {
                return;
            }

            setIsSaving(true);

            const body = {
                dagFileUrl: dagFileUrl || null,
            };

            const result = await patchPassageImportSettings(accessToken, body);

            if (!isApiRequestResultOk(result)) {
                ToastService.getToastr().error("Une erreur est survenue");
                setIsSaving(false);
                return;
            }

            ToastService.getToastr().success("Paramètres enregistrés");

            setPassageImportSettingsData(result.json);
            setIsSaving(false);
        },
        [accessToken, dagFileUrl],
    );

    React.useEffect(() => {
        if (!passageImportSettingsData) {
            return;
        }

        setDagFileUrl(passageImportSettingsData.dagFileUrl ?? "");
    }, [passageImportSettingsData]);

    const isDagFileUrlValid = !dagFileUrl || stringUtils.isValidUrl(dagFileUrl);

    return (
        <Page
            id="admin-passage-import-settings"
            title="Paramètres d'import des passages"
        >
            <Row>
                <Col>
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb label="Paramètres d'import des passages" />
                    </Breadcrumbs>
                </Col>
            </Row>

            <Row>
                <Col lg={6} md={9} sm={12}>
                    <form
                        onSubmit={(e) => {
                            void onSubmit(e);
                        }}
                    >
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
                                isSaving ||
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
