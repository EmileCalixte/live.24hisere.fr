import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { COUNTRY_CODE_FRANCE, GENDER } from "@live24hisere/core/constants";
import type { Gender } from "@live24hisere/core/types";
import { COUNTRY_NULL_OPTION_VALUE } from "../../../../constants/forms";
import { usePostAdminRunner } from "../../../../hooks/api/requests/admin/runners/usePostAdminRunner";
import { getRunnerCreateBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import Page from "../../../ui/Page";
import RunnerDetailsForm from "../../../viewParts/admin/runners/RunnerDetailsForm";

export default function CreateRunnerAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const postRunnerMutation = usePostAdminRunner();

  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [gender, setGender] = React.useState<Gender>(GENDER.M);
  const [birthYear, setBirthYear] = React.useState((new Date().getFullYear() - 30).toString());
  const [countryCode, setCountryCode] = React.useState(COUNTRY_CODE_FRANCE);
  const [isPublic, setIsPublic] = React.useState(true);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    const body = {
      firstname,
      lastname,
      gender,
      birthYear: parseInt(birthYear),
      countryCode: countryCode === COUNTRY_NULL_OPTION_VALUE ? null : countryCode,
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
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            submitButtonDisabled={postRunnerMutation.isPending}
          />
        </Col>
      </Row>
    </Page>
  );
}
