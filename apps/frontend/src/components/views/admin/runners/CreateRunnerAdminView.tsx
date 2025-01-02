import React, { useCallback, useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GENDER } from "@live24hisere/core/constants";
import type { AdminRaceWithRunnerCount, Gender } from "@live24hisere/core/types";
import { useStateWithNonNullableSetter } from "../../../../hooks/useStateWithNonNullableSetter";
import { getAdminRaces } from "../../../../services/api/raceService";
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

  const [races, setRaces] = useState<AdminRaceWithRunnerCount[] | false>(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState<Gender>(GENDER.M);
  const [birthYear, setBirthYear] = useState((new Date().getFullYear() - 30).toString());
  const [isPublic, setIsPublic] = React.useState(false);
  const [raceId, setRaceId] = useStateWithNonNullableSetter<number | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const fetchRaces = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminRaces(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des courses");
      return;
    }

    const responseRaces = result.json.races;

    if (responseRaces.length < 1) {
      ToastService.getToastr().warning(
        "Aucune course n'a été créée. Au moins une course doit exister pour enregistrer un coureur.",
      );
    }

    setRaces(responseRaces);

    if (raceId === null && responseRaces.length > 0) {
      setRaceId(responseRaces[0].id);
    }
  }, [accessToken, raceId, setRaceId]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!accessToken || raceId === null) {
        return;
      }

      setIsSaving(true);

      const body = {
        firstname,
        lastname,
        gender,
        birthYear: parseInt(birthYear),
        isPublic,
        raceId,
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
    [accessToken, raceId, firstname, lastname, gender, birthYear, isPublic, navigate],
  );

  useEffect(() => {
    void fetchRaces();
  }, [fetchRaces]);

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
            submitButtonDisabled={isSaving || (races && races.length < 1)}
          />
        </Col>
      </Row>
    </Page>
  );
}
