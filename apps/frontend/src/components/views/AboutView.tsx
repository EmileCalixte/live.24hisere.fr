import type React from "react";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { spaceship } from "../../../../../packages/utils/src/compare-utils";
// If this crashes, run `pnpm export-licenses`
import licenses from "../../assets/licenses.json";
import { Card } from "../ui/Card";
import LinkBlank from "../ui/LinkBlank";
import Page from "../ui/Page";

interface ThirdParty {
  author?: string;
  description?: string;
  homepage?: string;
  license: string;
  name: string;
  versions: string[];
}

type Licenses = Record<string, ThirdParty[]>;

const thirdPartySoftwares = Object.values(licenses as Licenses)
  .flatMap((software) => software)
  .sort((a, b) => spaceship(a.name, b.name));

export default function AboutView(): React.ReactElement {
  return (
    <Page
      id="about"
      htmlTitle="À propos"
      title="À propos"
      aboveTitle={
        <p className="mt-3">
          <Link to="/" className="flex items-baseline gap-1">
            <span className="text-sm !no-underline">
              <FontAwesomeIcon icon={faChevronLeft} />
            </span>
            Retour à l'accueil
          </Link>
        </p>
      }
    >
      <Card className="flex flex-col gap-3">
        <p>
          Application développée pour <LinkBlank to="https://www.24hisere.fr">Les 24 Heures de l'Isère</LinkBlank> par
          Emile Calixte, avec l'aide précieuse de{" "}
          <LinkBlank to="https://github.com/DjesonPV">Djeson Pascal-Valette</LinkBlank> et{" "}
          <LinkBlank to="https://github.com/Draphikas">Thomas Bocquez</LinkBlank>.
        </p>

        <p>
          Toutes les données disponibles sur cette application sont extraites du système de chronométrage. Toutefois,
          ayant un but purement indicatif, les calculs peuvent éventuellement contenir des erreurs ou des imprécisions.
          Seules les données du poste de chronométrage font foi.
        </p>

        <p>
          <LinkBlank to="https://github.com/EmileCalixte/live.24hisere.fr">Code source</LinkBlank>
        </p>

        <p>
          Les drapeaux nationaux proviennent de la bibliothèque{" "}
          <LinkBlank to="https://www.npmjs.com/package/country-flag-icons">country-flag-icons</LinkBlank> de{" "}
          <LinkBlank to="https://gitlab.com/catamphetamine">Nikolay Kuchumov</LinkBlank>.
        </p>

        <p>Cette application fonctionne grâce à des programmes tiers :</p>

        <ul>
          {thirdPartySoftwares.map((software, index) => (
            <li key={index}>
              <LinkBlank to={software.homepage}>{software.name}</LinkBlank> ({software.versions.sort().join(", ")})
              {software.author && <> – {software.author}</>} – <i>{software.license}</i>
            </li>
          ))}
        </ul>
      </Card>
    </Page>
  );
}
