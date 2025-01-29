import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GENDER } from "@live24hisere/core/constants";
import type { Gender } from "@live24hisere/core/types";
import { usePostAdminRunner } from "../../../../hooks/api/requests/admin/runners/usePostAdminRunner";
import { getRunnerCreateBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import Page from "../../../ui/Page";
import RunnerDetailsForm from "../../../viewParts/admin/runners/RunnerDetailsForm";

export default function CreateRunnerAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const postRunnerMutation = usePostAdminRunner();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState<Gender>(GENDER.M);
  const [birthYear, setBirthYear] = useState((new Date().getFullYear() - 30).toString());
  const [isPublic, setIsPublic] = React.useState(false);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    const body = {
      firstname,
      lastname,
      gender,
      birthYear: parseInt(birthYear),
      isPublic,
    };

    postRunnerMutation.mutate(body, {
      onSuccess: ({ runner }) => {
        void navigate(`/admin/runners/${runner.id}`);
      },
    });
  };

  return (
    <Page id="admin-create-runner" title="Créer un coureur">
      <Row>
        <Col>{getRunnerCreateBreadcrumbs()}</Col>
      </Row>

      <Row>
        <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
          <h2>Créer un coureur</h2>

          <RunnerDetailsForm
            onSubmit={onSubmit}
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
            submitButtonDisabled={postRunnerMutation.isPending}
          />
        </Col>
      </Row>
    </Page>
  );
}
