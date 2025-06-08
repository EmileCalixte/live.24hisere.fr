import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDeleteAdminCustomRunnerCategory } from "../../../../hooks/api/requests/admin/customRunnerCategories/useDeleteAdminCustomRunnerCategory";
import { useGetAdminCustomRunnerCategories } from "../../../../hooks/api/requests/admin/customRunnerCategories/useGetAdminCustomRunnerCategories";
import { useGetAdminCustomRunnerCategory } from "../../../../hooks/api/requests/admin/customRunnerCategories/useGetAdminCustomRunnerCategory";
import { usePatchAdminCustomRunnerCategory } from "../../../../hooks/api/requests/admin/customRunnerCategories/usePatchAdminCustomRunnerCategory";
import { useGetAdminEditions } from "../../../../hooks/api/requests/admin/editions/useGetAdminEditions";
import { useGetAdminRaces } from "../../../../hooks/api/requests/admin/races/useGetAdminRaces";
import { useRequiredParams } from "../../../../hooks/useRequiredParams";
import { getCustomRunnerCategoryDetailsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { is404Error } from "../../../../utils/apiUtils";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { Button } from "../../../ui/forms/Button";
import { Link } from "../../../ui/Link";
import Page from "../../../ui/Page";
import { Separator } from "../../../ui/Separator";
import { Table, Td, Th, Tr } from "../../../ui/Table";
import CustomRunnerCategoryDetailsForm from "../../../viewParts/admin/customRunnerCategories/CustomRunnerCategoryDetailsForm";

export default function CustomRunnerCategoryDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { categoryId: urlCategoryId } = useRequiredParams(["categoryId"]);

  const getCategoryQuery = useGetAdminCustomRunnerCategory(urlCategoryId);
  const category = getCategoryQuery.data?.customRunnerCategory;
  const isCategoryNotFound = is404Error(getCategoryQuery.error);

  const getCategoriesQuery = useGetAdminCustomRunnerCategories();
  const existingCategories = getCategoriesQuery.data?.customRunnerCategories;

  const getRacesQuery = useGetAdminRaces();
  const races = getRacesQuery.data?.races;

  const getEditionsQuery = useGetAdminEditions();
  const editions = getEditionsQuery.data?.editions;

  const patchCategoryMutation = usePatchAdminCustomRunnerCategory(category?.id);
  const deleteCategoryMutation = useDeleteAdminCustomRunnerCategory(category?.id);

  const [categoryCode, setCategoryCode] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");

  const unsavedChanges = React.useMemo(() => {
    if (!category) {
      return false;
    }

    return [categoryCode === category.code, categoryName === category.name].includes(false);
  }, [category, categoryCode, categoryName]);

  React.useEffect(() => {
    if (!category) {
      return;
    }

    setCategoryCode(category.code);
    setCategoryName(category.name);
  }, [category]);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    const body = {
      code: categoryCode,
      name: categoryName,
    };

    patchCategoryMutation.mutate(body, {
      onSuccess: () => {
        void getCategoryQuery.refetch();
        void getCategoriesQuery.refetch();
      },
    });
  };

  function deleteCategory(): void {
    if (!category || category.runners.length > 0) {
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      return;
    }

    deleteCategoryMutation.mutate(undefined, {
      onSuccess: () => {
        void navigate("/admin/custom-runner-categories");
      },
    });
  }

  if (isCategoryNotFound) {
    return <Navigate to="/admin/custom-runner-categories" />;
  }

  const codeAlreadyExists =
    (existingCategories?.map((category) => category.code).includes(categoryCode) ?? false)
    && categoryCode !== category?.code;

  return (
    <Page
      id="admin-custom-runner-category-details"
      htmlTitle={category === undefined ? "Chargement" : `Détails de la catégorie personnalisée ${category.name}`}
      title={category === undefined ? undefined : `Détails de la catégorie personnalisée ${category.name}`}
      breadCrumbs={getCustomRunnerCategoryDetailsBreadcrumbs(category)}
    >
      {category === undefined ? (
        <CircularLoader />
      ) : (
        <Card className="flex flex-col gap-3">
          <h2>Détails de la catégorie</h2>

          <div className="w-full md:w-1/2 xl:w-1/4">
            <CustomRunnerCategoryDetailsForm
              onSubmit={onSubmit}
              code={categoryCode}
              setCode={setCategoryCode}
              codeAlreadyExists={codeAlreadyExists}
              name={categoryName}
              setName={setCategoryName}
              submitButtonDisabled={
                patchCategoryMutation.isPending || getCategoryQuery.isPending || codeAlreadyExists || !unsavedChanges
              }
            />
          </div>

          <Separator className="my-5" />

          <h2>Coureurs</h2>

          {category.runners.length > 0 ? (
            <div>
              <Table>
                <thead>
                  <Tr>
                    <Th>Nom</Th>
                    <Th>Course</Th>
                    <Th>Détails du participant</Th>
                  </Tr>
                </thead>
                <tbody>
                  {category.runners.map((runner) => {
                    const race = races?.find((race) => race.id === runner.raceId);
                    const edition = editions?.find((edition) => edition.id === race?.editionId);

                    return (
                      <Tr key={runner.id}>
                        <Td>
                          {runner.firstname} {runner.lastname.toUpperCase()}
                        </Td>
                        <Td>{race && edition ? `${race.name} (${edition.name})` : <CircularLoader />}</Td>
                        <Td>
                          {race ? (
                            <Link to={`/admin/races/${race.id}/runners/${runner.id}`}>Détails</Link>
                          ) : (
                            <CircularLoader />
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ) : (
            <p>Aucun coureur n'est assigné à cette catégorie.</p>
          )}

          <Separator className="my-5" />

          <h2>Supprimer la catégorie</h2>

          {category.runners.length > 0 ? (
            <p>La catégorie ne peut pas être supprimée tant qu'elle est assignée à des coureurs.</p>
          ) : (
            <p>Cette action est irréversible.</p>
          )}

          <div>
            <Button
              color="red"
              disabled={category.runners.length > 0}
              isLoading={deleteCategoryMutation.isPending}
              onClick={deleteCategory}
            >
              Supprimer la catégorie
            </Button>
          </div>
        </Card>
      )}
    </Page>
  );
}
