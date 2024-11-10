import { type PublicEdition, type PublicRace, type Runner } from "@live24hisere/core/types";
import Breadcrumbs from "../../components/ui/breadcrumbs/Breadcrumbs";
import Crumb, { type CrumbProps } from "../../components/ui/breadcrumbs/Crumb";
import CircularLoader from "../../components/ui/CircularLoader";
import { type ComponentElement } from "../../types/utils/react";

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

export function getImportPassagesSettingsBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs([getAdminCrumb(), { label: "Paramètres d'import des passages" }]);
}

export function getImportRunnersCsvBreadcrumbs(): BreadcrumbsElement {
  return getBreadcrumbs([...getRunnersCrumbs(true), { label: "Import via fichier CSV" }]);
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

export function getRunnerDetailsBreadcrumbs(runner: Runner | undefined): BreadcrumbsElement {
  return getBreadcrumbs(getRunnerCrumbs(runner));
}

function getAdminCrumb(): CrumbProps {
  return { label: "Administration", url: "/admin" };
}

function getEditionsCrumbs(clickable: boolean = false): CrumbProps[] {
  const editionsCrumb: CrumbProps = { label: "Éditions" };

  if (clickable) {
    editionsCrumb.url = "/admin/editions";
  }

  return [getAdminCrumb(), editionsCrumb];
}

function getEditionCrumbs(edition: PublicEdition | undefined, clickable: boolean = false): BreadcrumbsItem[] {
  let editionCrumb: BreadcrumbsItem;

  if (!edition) {
    editionCrumb = "LOADER";
  } else {
    editionCrumb = { label: edition.name };

    if (clickable) {
      editionCrumb.url = `/admin/editions/${edition.id}`;
    }
  }

  return [...getEditionsCrumbs(true), editionCrumb];
}

function getRacesCrumbs(clickable: boolean = false): CrumbProps[] {
  const racesCrumb: CrumbProps = { label: "Courses" };

  if (clickable) {
    racesCrumb.url = "/admin/races";
  }

  return [getAdminCrumb(), racesCrumb];
}

function getRaceCrumbs(
  edition: PublicEdition | undefined,
  race: PublicRace | undefined,
  clickable: boolean = false,
): BreadcrumbsItem[] {
  let raceCrumb: BreadcrumbsItem;

  if (!race) {
    raceCrumb = "LOADER";
  } else {
    raceCrumb = { label: race.name };

    if (clickable) {
      raceCrumb.url = `/admin/races/${race.id}`;
    }
  }

  return [...getEditionCrumbs(edition, true), raceCrumb];
}

function getRunnersCrumbs(clickable: boolean = false): CrumbProps[] {
  const runnersCrumb: CrumbProps = { label: "Coureurs" };

  if (clickable) {
    runnersCrumb.url = "/admin/runners";
  }

  return [getAdminCrumb(), runnersCrumb];
}

function getRunnerCrumbs(runner: Runner | undefined): BreadcrumbsItem[] {
  let runnerCrumb: BreadcrumbsItem;

  if (!runner) {
    runnerCrumb = "LOADER";
  } else {
    runnerCrumb = { label: `${runner.lastname.toUpperCase()} ${runner.firstname}` };
  }

  return [...getRunnersCrumbs(true), runnerCrumb];
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
