import type React from "react";
import { useGetAdminCustomRunnerCategories } from "../../../../hooks/api/requests/admin/customRunnerCategories/useGetAdminCustomRunnerCategories";
import { getCustomRunnerCategoriesBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ComplexPageTitle from "../../../ComplexPageTitle";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { Link } from "../../../ui/Link";
import Page from "../../../ui/Page";
import { Table, Td, Th, Tr } from "../../../ui/Table";

export default function CustomRunnerCategoriesAdminView(): React.ReactElement {
  const getCategoriesQuery = useGetAdminCustomRunnerCategories();
  const categories = getCategoriesQuery.data?.customRunnerCategories;

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
      {getCategoriesQuery.isLoading && <CircularLoader />}

      {categories && (
        <Card>
          {categories.length === 0 && <p>Aucune catégorie de coureurs personnalisée</p>}

          {categories.length > 0 && (
            <Table>
              <thead>
                <Tr>
                  <Th>Code – Nom</Th>
                  <Th>Nb. coureurs</Th>
                </Tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <Tr key={category.id}>
                    <Td>
                      <Link to={`/admin/custom-runner-categories/${category.id}`}>
                        {category.code} – {category.name}
                      </Link>
                    </Td>
                    <Td>{category.runnerCount}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}
    </Page>
  );
}
