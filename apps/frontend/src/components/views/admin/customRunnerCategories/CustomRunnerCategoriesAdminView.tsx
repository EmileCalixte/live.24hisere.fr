import type React from "react";
import { getCustomRunnerCategoriesBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ComplexPageTitle from "../../../ComplexPageTitle";
import Page from "../../../ui/Page";

export default function CustomRunnerCategoriesAdminView(): React.ReactElement {
  return (
    <Page
      id="admin-custom-runner-categories"
      htmlTitle="Catégories personnalisées"
      title={
        <ComplexPageTitle createButtonUrl="/admin/custom-runner-categories/create">
          Catégories personnalisées
        </ComplexPageTitle>
      }
      breadCrumbs={getCustomRunnerCategoriesBreadcrumbs()}
    >
      <p>TODO</p>
    </Page>
  );
}
