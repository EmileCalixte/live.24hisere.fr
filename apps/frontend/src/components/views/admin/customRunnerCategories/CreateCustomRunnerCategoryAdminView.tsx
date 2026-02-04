import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAdminCustomRunnerCategories } from "../../../../hooks/api/requests/admin/customRunnerCategories/useGetAdminCustomRunnerCategories";
import { usePostAdminCustomRunnerCategory } from "../../../../hooks/api/requests/admin/customRunnerCategories/usePostAdminCustomRunnerCategory";
import { getCustomRunnerCategoryCreateBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import type { FormSubmitEventHandler } from "../../../../types/utils/react";
import { Card } from "../../../ui/Card";
import Page from "../../../ui/Page";
import CustomRunnerCategoryDetailsForm from "../../../viewParts/admin/customRunnerCategories/CustomRunnerCategoryDetailsForm";

export default function CreateCustomRunerCategoryAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const getCategoriesQuery = useGetAdminCustomRunnerCategories();
  const existingCategories = getCategoriesQuery.data?.customRunnerCategories;

  const postCategoryMutation = usePostAdminCustomRunnerCategory();

  const [categoryCode, setCategoryCode] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");

  const onSubmit: FormSubmitEventHandler = (e) => {
    e.preventDefault();

    const body = {
      code: categoryCode,
      name: categoryName,
    };

    postCategoryMutation.mutate(body, {
      onSuccess: ({ customRunnerCategory: category }) => {
        void navigate(`/admin/custom-runner-categories/${category.id}`);
      },
    });
  };

  const codeAlreadyExists = existingCategories?.map((category) => category.code).includes(categoryCode) ?? false;

  return (
    <Page
      id="admin-create-custom-runner-category"
      htmlTitle="Créer une catégorie personnalisée"
      title="Créer une catégorie personnalisée"
      breadCrumbs={getCustomRunnerCategoryCreateBreadcrumbs()}
    >
      <Card className="flex flex-col gap-3">
        <div className="w-full md:w-1/2 xl:w-1/4">
          <CustomRunnerCategoryDetailsForm
            onSubmit={onSubmit}
            code={categoryCode}
            setCode={setCategoryCode}
            codeAlreadyExists={codeAlreadyExists}
            name={categoryName}
            setName={setCategoryName}
            submitButtonDisabled={codeAlreadyExists || postCategoryMutation.isPending}
          />
        </div>
      </Card>
    </Page>
  );
}
