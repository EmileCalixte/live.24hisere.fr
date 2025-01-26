import React, { useCallback, useContext, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GENDER } from "@live24hisere/core/constants";
import type { Gender } from "@live24hisere/core/types";
import { postAdminRunner } from "../../../../services/api/runnerService";
import { getRunnerCreateBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import Page from "../../../ui/Page";
import RunnerDetailsForm from "../../../viewParts/admin/runners/RunnerDetailsForm";

export default function CreateRunnerAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = useContext(appContext).user;

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState<Gender>(GENDER.M);
  const [birthYear, setBirthYear] = useState((new Date().getFullYear() - 30).toString());
  const [isPublic, setIsPublic] = React.useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!accessToken) {
        return;
      }

      setIsSaving(true);

      const body = {
        firstname,
        lastname,
        gender,
        birthYear: parseInt(birthYear),
        isPublic,
      };

      const result = await postAdminRunner(accessToken, body);

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        setIsSaving(false);
        return;
      }

      const id = result.json.runner.id;

      ToastService.getToastr().success("Coureur créé");
      void navigate(`/admin/runners/${id}`);
    },
    [accessToken, firstname, lastname, gender, birthYear, isPublic, navigate],
  );

  return (
    <Page id="admin-create-runner" title="Créer un coureur">
      <Row>
        <Col>{getRunnerCreateBreadcrumbs()}</Col>
      </Row>

      <Row>
        <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
          <h2>Créer un coureur</h2>

          <RunnerDetailsForm
            onSubmit={(e) => {
              void onSubmit(e);
            }}
            firstname={firstname}
            setFirstname={setFirstname}
            lastname={lastname}
            setLastname={setLastname}
            gender={gender}
            setGender={setGender}
            birthYear={birthYear}
            setBirthYear={setBirthYear}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            submitButtonDisabled={isSaving}
          />
        </Col>
      </Row>
    </Page>
  );
}
