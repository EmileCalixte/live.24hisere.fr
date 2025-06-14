import type { AdminRunner, CustomRunnerCategory, PublicEdition, PublicRace } from "@live24hisere/core/types";
import Breadcrumbs from "../../components/ui/breadcrumbs/Breadcrumbs";
import Crumb, { type CrumbProps } from "../../components/ui/breadcrumbs/Crumb";
import CircularLoader from "../../components/ui/CircularLoader";
import type { ComponentElement } from "../../types/utils/react";

type BreadcrumbsItem = CrumbProps | "LOADER";

type BreadcrumbsElement = ComponentElement<typeof Breadcrumbs>;

export function getDisabledAppBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs([getAdminCrumb(), { label: "Accès à l'application" }]);
}

export function getEditionsBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs(getEditionsCrumbs());
}

export function getEditionCreateBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs([...getEditionsCrumbs(true), { label: "Créer une édition" }]);
}

export function getEditionDetailsBreadcrumbs(edition: PublicEdition | undefined): BreadcrumbsElement {
  return getBreadcrumbs(getEditionCrumbs(edition));
}

export function getFastestLapsBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs([getAdminCrumb(), { label: "Tours les plus rapides" }]);
}

export function getRacesBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs(getRacesCrumbs());
}

export function getRaceCreateBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs([...getRacesCrumbs(true), { label: "Créer une course" }]);
}

export function getRaceDetailsBreadcrumbs(
  edition: PublicEdition | undefined,
  race: PublicRace | undefined,
): BreadcrumbsElement {
  return getBreadcrumbs(getRaceCrumbs(edition, race));
}

export function getRunnersBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs(getRunnersCrumbs());
}

export function getRunnerCreateBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs([...getRunnersCrumbs(true), { label: "Créer un coureur" }]);
}

export function getRunnerDetailsBreadcrumbs(runner: AdminRunner | undefined): BreadcrumbsElement {
  return getBreadcrumbs(getRunnerCrumbs(runner));
}

export function getCreateParticipantBreadcrumbs(
  edition: PublicEdition | undefined,
  race: PublicRace | undefined,
): BreadcrumbsElement {
  return getBreadcrumbs([...getRaceCrumbs(edition, race, true), { label: "Ajouter un coureur" }]);
}

export function getParticipantBreadcrumbs(
  edition: PublicEdition | undefined,
  race: PublicRace | undefined,
  runner: AdminRunner | undefined,
): BreadcrumbsElement {
  return getBreadcrumbs([...getRaceCrumbs(edition, race, true), getRunnerCrumb(runner)]);
}

export function getCustomRunnerCategoriesBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs(getCustomRunnerCategoriesCrumbs());
}

export function getCustomRunnerCategoryCreateBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs([...getCustomRunnerCategoriesCrumbs(true), { label: "Créer une catégorie personnalisée" }]);
}

export function getCustomRunnerCategoryDetailsBreadcrumbs(
  category: CustomRunnerCategory | undefined,
): BreadcrumbsElement {
  return getBreadcrumbs(getCustomRunnerCategoryCrumbs(category));
}

export function getPassageImportRulesBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs(getPassageImportRulesCrumbs());
}

export function getCreatePassageImportRuleBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs([...getPassageImportRulesCrumbs(true), { label: "Créer une règle" }]);
}

export function getEditPassageImportRuleBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs([...getPassageImportRulesCrumbs(true), { label: "Modifier une règle" }]);
}

function getAdminCrumb(): CrumbProps {
  return { label: "Administration", url: "/admin" };
}

function getEditionsCrumbs(clickable = false): CrumbProps[] {
  const editionsCrumb: CrumbProps = { label: "Éditions" };

  if (clickable) {
    editionsCrumb.url = "/admin/editions";
  }

  return [getAdminCrumb(), editionsCrumb];
}

function getEditionCrumbs(edition: PublicEdition | undefined, clickable = false): BreadcrumbsItem[] {
  let editionCrumb: BreadcrumbsItem = "LOADER";

  if (edition) {
    editionCrumb = { label: edition.name };

    if (clickable) {
      editionCrumb.url = `/admin/editions/${edition.id}`;
    }
  }

  return [...getEditionsCrumbs(true), editionCrumb];
}

function getRacesCrumbs(clickable = false): CrumbProps[] {
  const racesCrumb: CrumbProps = { label: "Courses" };

  if (clickable) {
    racesCrumb.url = "/admin/races";
  }

  return [getAdminCrumb(), racesCrumb];
}

function getRaceCrumbs(
  edition: PublicEdition | undefined,
  race: PublicRace | undefined,
  clickable = false,
): BreadcrumbsItem[] {
  let raceCrumb: BreadcrumbsItem = "LOADER";

  if (race) {
    raceCrumb = { label: race.name };

    if (clickable) {
      raceCrumb.url = `/admin/races/${race.id}`;
    }
  }

  return [...getEditionCrumbs(edition, true), raceCrumb];
}

function getRunnersCrumbs(clickable = false): CrumbProps[] {
  const runnersCrumb: CrumbProps = { label: "Coureurs" };

  if (clickable) {
    runnersCrumb.url = "/admin/runners";
  }

  return [getAdminCrumb(), runnersCrumb];
}

function getRunnerCrumbs(runner: AdminRunner | undefined): BreadcrumbsItem[] {
  return [...getRunnersCrumbs(true), getRunnerCrumb(runner)];
}

function getRunnerCrumb(runner: AdminRunner | undefined): BreadcrumbsItem {
  if (!runner) {
    return "LOADER";
  }

  return { label: `${runner.lastname.toUpperCase()} ${runner.firstname}` };
}

function getCustomRunnerCategoriesCrumbs(clickable = false): CrumbProps[] {
  const customRunnerCategoriesCrumb: CrumbProps = { label: "Catégories personnalisées" };

  if (clickable) {
    customRunnerCategoriesCrumb.url = "/admin/custom-runner-categories";
  }
  return [getAdminCrumb(), customRunnerCategoriesCrumb];
}

function getCustomRunnerCategoryCrumbs(
  category: CustomRunnerCategory | undefined,
  clickable = false,
): BreadcrumbsItem[] {
  let raceCrumb: BreadcrumbsItem = "LOADER";

  if (category) {
    raceCrumb = { label: category.name };

    if (clickable) {
      raceCrumb.url = `/admin/custom-runner-categories/${category.id}`;
    }
  }

  return [...getCustomRunnerCategoriesCrumbs(true), raceCrumb];
}

function getPassageImportRulesCrumbs(clickable = false): CrumbProps[] {
  const passageImportRulesCrumb: CrumbProps = { label: "Règles d'import de passages" };

  if (clickable) {
    passageImportRulesCrumb.url = "/admin/passage-import-rules";
  }

  return [getAdminCrumb(), passageImportRulesCrumb];
}

function getBreadcrumbs(data: BreadcrumbsItem[]): BreadcrumbsElement {
  return (
    <Breadcrumbs>
      {data.map((crumbData, index) => {
        if (crumbData === "LOADER") {
          return <CircularLoader key={index} />;
        }

        return <Crumb {...crumbData} key={index} />;
      })}
    </Breadcrumbs>
  );
}
