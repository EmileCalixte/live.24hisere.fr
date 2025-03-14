import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GENDER } from "@live24hisere/core/constants";
import type { Gender } from "@live24hisere/core/types";
import { COUNTRY_NULL_OPTION_VALUE } from "../../../../constants/forms";
import { appContext } from "../../../../contexts/AppContext";
import { useGetAdminEditions } from "../../../../hooks/api/requests/admin/editions/useGetAdminEditions";
import { useGetAdminRunnerParticipations } from "../../../../hooks/api/requests/admin/participants/useGetAdminRunnerParticipations";
import { useGetAdminRaces } from "../../../../hooks/api/requests/admin/races/useGetAdminRaces";
import { useDeleteAdminRunner } from "../../../../hooks/api/requests/admin/runners/useDeleteAdminRunner";
import { useGetAdminRunner } from "../../../../hooks/api/requests/admin/runners/useGetAdminRunner";
import { usePatchAdminRunner } from "../../../../hooks/api/requests/admin/runners/usePatchAdminRunner";
import { useRequiredParams } from "../../../../hooks/useRequiredParams";
import { getRunnerDetailsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { is404Error } from "../../../../utils/apiUtils";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { Button } from "../../../ui/forms/Button";
import Page from "../../../ui/Page";
import { Separator } from "../../../ui/Separator";
import RunnerDetailsForm from "../../../viewParts/admin/runners/RunnerDetailsForm";
import RunnerParticipationsTable from "../../../viewParts/admin/runners/RunnerParticipationsTable";

export default function RunnerDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const { runnerId: urlRunnerId } = useRequiredParams(["runnerId"]);

  const getRunnerQuery = useGetAdminRunner(urlRunnerId);
  const runner = getRunnerQuery.data?.runner;
  const isRunnerNotFound = is404Error(getRunnerQuery.error);

  const getParticipationsQuery = useGetAdminRunnerParticipations(runner?.id);
  const participations = getParticipationsQuery.data?.participations;

  const patchRunnerMutation = usePatchAdminRunner(runner?.id);
  const deleteRunnerMutation = useDeleteAdminRunner(runner?.id);

  const getEditionsQuery = useGetAdminEditions();
  const editions = getEditionsQuery.data?.editions;

  const getRacesQuery = useGetAdminRaces();
  const races = getRacesQuery.data?.races;

  const [runnerFirstname, setRunnerFirstname] = React.useState("");
  const [runnerLastname, setRunnerLastname] = React.useState("");
  const [runnerGender, setRunnerGender] = React.useState<Gender>(GENDER.M);
  const [runnerBirthYear, setRunnerBirthYear] = React.useState("0");
  const [runnerCountryCode, setRunnerCountryCode] = React.useState<string | null>(null);
  const [runnerIsPublic, setRunnerIsPublic] = React.useState(false);

  const unsavedChanges = React.useMemo(() => {
    if (!runner) {
      return false;
    }

    return [
      runnerFirstname === runner.firstname,
      runnerLastname === runner.lastname,
      runnerGender === runner.gender,
      runnerBirthYear === runner.birthYear,
      runnerCountryCode === runner.countryCode,
      runnerIsPublic === runner.isPublic,
    ].includes(false);
  }, [runner, runnerFirstname, runnerLastname, runnerGender, runnerBirthYear, runnerCountryCode, runnerIsPublic]);

  React.useEffect(() => {
    if (!runner) {
      return;
    }

    setRunnerFirstname(runner.firstname);
    setRunnerLastname(runner.lastname);
    setRunnerGender(runner.gender);
    setRunnerBirthYear(runner.birthYear);
    setRunnerCountryCode(runner.countryCode);
    setRunnerIsPublic(runner.isPublic);
  }, [runner]);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    if (!runner || !accessToken) {
      return;
    }

    const body = {
      firstname: runnerFirstname,
      lastname: runnerLastname,
      birthYear: parseInt(runnerBirthYear),
      countryCode: runnerCountryCode === COUNTRY_NULL_OPTION_VALUE ? null : runnerCountryCode,
      gender: runnerGender,
      isPublic: runnerIsPublic,
    };

    patchRunnerMutation.mutate(body, {
      onSuccess: () => {
        void getRunnerQuery.refetch();
      },
    });
  };

  function deleteRunner(): void {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce coureur ?")) {
      return;
    }

    deleteRunnerMutation.mutate(undefined, {
      onSuccess: () => {
        void navigate("/admin/runners");
      },
    });
  }

  if (isRunnerNotFound) {
    return <Navigate to="/admin/runners" />;
  }

  return (
    <Page
      id="admin-runner-details"
      htmlTitle={runner === undefined ? "Chargement" : `Détails du coureur ${runner.firstname} ${runner.lastname}`}
      title={runner === undefined ? undefined : `Détails du coureur ${runner.firstname} ${runner.lastname}`}
      breadCrumbs={getRunnerDetailsBreadcrumbs(runner)}
    >
      {runner === undefined ? (
        <CircularLoader />
      ) : (
        <Card className="flex flex-col gap-3">
          <h2>Détails du coureur</h2>

          <div className="w-full md:w-1/2 xl:w-1/4">
            <RunnerDetailsForm
              onSubmit={onSubmit}
              firstname={runnerFirstname}
              setFirstname={setRunnerFirstname}
              lastname={runnerLastname}
              setLastname={setRunnerLastname}
              gender={runnerGender}
              setGender={setRunnerGender}
              birthYear={runnerBirthYear}
              setBirthYear={setRunnerBirthYear}
              countryCode={runnerCountryCode}
              setCountryCode={setRunnerCountryCode}
              isPublic={runnerIsPublic}
              setIsPublic={setRunnerIsPublic}
              submitButtonDisabled={patchRunnerMutation.isPending || !unsavedChanges}
            />
          </div>

          <Separator className="my-5" />

          <h2>Participations</h2>

          {participations === undefined && <CircularLoader />}

          {participations && participations.length <= 0 && (
            <p>Ce coureur n'est enregistré comme participant sur aucune course.</p>
          )}

          {participations && participations.length > 0 && (
            <div>
              <RunnerParticipationsTable
                participations={participations}
                races={races ?? undefined}
                editions={editions}
              />
            </div>
          )}

          <Separator className="my-5" />

          <h3>Supprimer le coureur</h3>

          <p>
            Toutes les participations et tous les passages liés à ce coureur seront également supprimés. Cette action
            est irréversible.
          </p>

          <div>
            <Button color="red" onClick={deleteRunner}>
              Supprimer le coureur
            </Button>
          </div>
        </Card>
      )}
    </Page>
  );
}
