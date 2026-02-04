import React from "react";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navigate, useNavigate } from "react-router-dom";
import { arrayUtils } from "@live24hisere/utils";
import { useGetAdminEditions } from "../../../../hooks/api/requests/admin/editions/useGetAdminEditions";
import { useDeleteAdminPassageImportRule } from "../../../../hooks/api/requests/admin/passageImportRules/useDeleteAdminPassageImportRule";
import { useGetAdminPassageImportRule } from "../../../../hooks/api/requests/admin/passageImportRules/useGetAdminPassageImportRule";
import { usePatchAdminPassageImportRule } from "../../../../hooks/api/requests/admin/passageImportRules/usePatchAdminPassageImportRule";
import { useGetAdminRaces } from "../../../../hooks/api/requests/admin/races/useGetAdminRaces";
import { useRaceSelectOptions } from "../../../../hooks/useRaceSelectOptions";
import { useRequiredParams } from "../../../../hooks/useRequiredParams";
import { getEditPassageImportRuleBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import type { FormSubmitEventHandler } from "../../../../types/utils/react";
import { is404Error } from "../../../../utils/apiUtils";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { Button } from "../../../ui/forms/Button";
import Select from "../../../ui/forms/Select";
import Page from "../../../ui/Page";
import { Separator } from "../../../ui/Separator";
import PassageImportRuleDetailsForm from "../../../viewParts/admin/passageImportRules/PassageImportRuleDetailsForm";

export default function PassageImportRuleDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { ruleId } = useRequiredParams(["ruleId"]);

  const getRuleQuery = useGetAdminPassageImportRule(ruleId);
  const rule = getRuleQuery.data?.rule;
  const isRuleNotFound = is404Error(getRuleQuery.error);

  const patchRuleMutation = usePatchAdminPassageImportRule(rule?.id);
  const deleteRuleMutation = useDeleteAdminPassageImportRule(rule?.id);

  const getEditionsQuery = useGetAdminEditions();
  const editions = getEditionsQuery.data?.editions;

  const getRacesQuery = useGetAdminRaces();
  const races = getRacesQuery.data?.races;

  const [url, setUrl] = React.useState("");
  const [isActive, setIsActive] = React.useState(false);
  const [raceIdToAdd, setRaceIdToAdd] = React.useState<number | undefined>(undefined);

  const allRaceOptions = useRaceSelectOptions(races, (race) => {
    const edition = editions?.find((edition) => edition.id === race.editionId);

    if (edition) {
      return `${edition.name} – ${race.name}`;
    }

    return race.name;
  });

  const raceOptions = React.useMemo(
    () => allRaceOptions.filter((option) => !arrayUtils.inArray(option.value, rule?.raceIds ?? [])),
    [allRaceOptions, rule?.raceIds],
  );

  const unsavedChanges = React.useMemo(() => {
    if (!rule) {
      return false;
    }

    return [url === rule.url, isActive === rule.isActive].includes(false);
  }, [rule, url, isActive]);

  React.useEffect(() => {
    if (!rule) {
      return;
    }

    setUrl(rule.url);
    setIsActive(rule.isActive);
  }, [rule]);

  const onSubmit: FormSubmitEventHandler = (e) => {
    e.preventDefault();

    const body = { url, isActive };

    patchRuleMutation.mutate(body, {
      onSuccess: () => {
        void getRuleQuery.refetch();
      },
    });
  };

  const onRaceAddFormSubmit: FormSubmitEventHandler = (e) => {
    e.preventDefault();

    if (!rule || raceIdToAdd === undefined) {
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir ajouter cette course à cette règle d'import de passages ?")) {
      return;
    }

    const ruleWasActive = rule.isActive;

    const body = {
      raceIds: [...rule.raceIds, raceIdToAdd],
      isActive: false,
    };

    patchRuleMutation.mutate(body, {
      onSuccess: () => {
        void getRuleQuery.refetch();

        if (ruleWasActive) {
          ToastService.getToastr().success(
            "La règle a été désactivée suite à l'ajout d'une course. Pensez à la réactiver !",
          );
        }
      },
    });
  };

  function removeRace(raceId: number): void {
    if (!rule) {
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette course de cette règle d'import de passages ?")) {
      return;
    }

    const body = {
      raceIds: rule.raceIds.filter((id) => id !== raceId),
    };

    patchRuleMutation.mutate(body, {
      onSuccess: () => {
        void getRuleQuery.refetch();
      },
    });
  }

  function deleteRule(): void {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette règle d'import de passages ?")) {
      return;
    }

    deleteRuleMutation.mutate(undefined, {
      onSuccess: () => {
        void navigate("/admin/passage-import-rules");
      },
    });
  }

  if (isRuleNotFound) {
    return <Navigate to="/admin/passage-import-rules" />;
  }

  return (
    <Page
      id="admin-passage-import-rule-details"
      htmlTitle="Détails de la règle d'import de passages"
      title="Détails de la règle d'import de passages"
      breadCrumbs={getEditPassageImportRuleBreadcrumbs()}
    >
      {rule === undefined ? (
        <CircularLoader />
      ) : (
        <Card className="flex flex-col gap-3">
          <h2>Détails de la règle</h2>

          <div className="w-full md:w-2/3 xl:w-1/3">
            <PassageImportRuleDetailsForm
              onSubmit={onSubmit}
              url={url}
              setUrl={setUrl}
              isActive={isActive}
              setIsActive={setIsActive}
              submitButtonDisabled={!unsavedChanges}
            />
          </div>

          <Separator className="my-5" />

          <h2>Courses</h2>

          {!races || !editions ? (
            <CircularLoader />
          ) : (
            <>
              {rule.raceIds.length > 0 ? (
                <div>
                  <table>
                    <tbody>
                      {rule.raceIds.map((raceId) => (
                        <tr key={raceId} className="flex items-center gap-3">
                          <td className="grow">{allRaceOptions.find((option) => option.value === raceId)?.label}</td>
                          <td>
                            <Button
                              size="sm"
                              color="red"
                              icon={
                                <FontAwesomeIcon
                                  icon={faMinus}
                                  onClick={() => {
                                    removeRace(raceId);
                                  }}
                                />
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>Cette règle n'est liée à aucune course.</p>
              )}

              <form className="flex w-full items-end gap-3 md:w-2/3 xl:w-1/3" onSubmit={onRaceAddFormSubmit}>
                <div className="grow">
                  <Select
                    label="Ajouter une course"
                    placeholderLabel="Sélectionnez une course à ajouter"
                    options={raceOptions}
                    value={raceIdToAdd}
                    onChange={(e) => {
                      setRaceIdToAdd(Number(e.target.value));
                    }}
                  />
                </div>
                <div>
                  <Button
                    disabled={raceIdToAdd === undefined}
                    isLoading={raceIdToAdd !== undefined && patchRuleMutation.isPending}
                  >
                    OK
                  </Button>
                </div>
              </form>
            </>
          )}

          <Separator className="my-5" />

          <h2>Supprimer la règle</h2>

          <div>
            <Button color="red" onClick={deleteRule}>
              Supprimer la règle
            </Button>
          </div>
        </Card>
      )}
    </Page>
  );
}
