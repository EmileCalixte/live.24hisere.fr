import type React from "react";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { spaceship } from "../../../../../packages/utils/src/compare-utils";
// If this crashes, run `pnpm export-licenses`
import licenses from "../../assets/licenses.json";
import { Card } from "../ui/Card";
import { Link } from "../ui/Link";
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
          Application développée pour{" "}
          <Link to="https://www.24hisere.fr" target="_blank">
            Les 24 Heures de l'Isère
          </Link>{" "}
          par Emile Calixte, avec l'aide précieuse de{" "}
          <Link to="https://github.com/DjesonPV" target="_blank">
            Djeson Pascal-Valette
          </Link>
          ,{" "}
          <Link to="https://github.com/Kalvineur" target="_blank">
            Kalvin Pascal-Valette
          </Link>{" "}
          et{" "}
          <Link to="https://github.com/Draphikas" target="_blank">
            Thomas Bocquez
          </Link>
          .
        </p>

        <p>
          Toutes les données disponibles sur cette application sont extraites du système de chronométrage. Toutefois,
          ayant un but purement indicatif, les calculs peuvent éventuellement contenir des erreurs ou des imprécisions.
          Seules les données du poste de chronométrage font foi.
        </p>

        <p>
          <Link to="https://github.com/EmileCalixte/live.24hisere.fr" target="_blank">
            Code source
          </Link>
        </p>

        <p>
          Les drapeaux nationaux proviennent de la bibliothèque{" "}
          <Link to="https://www.npmjs.com/package/country-flag-icons" target="_blank">
            country-flag-icons
          </Link>{" "}
          de{" "}
          <Link to="https://gitlab.com/catamphetamine" target="_blank">
            Nikolay Kuchumov
          </Link>
          .
        </p>

        <p>Cette application fonctionne grâce à des programmes tiers :</p>

        <ul>
          {thirdPartySoftwares.map((software, index) => (
            <li key={index}>
              <Link to={software.homepage} target="_blank">
                {software.name}
              </Link>{" "}
              ({software.versions.sort().join(", ")}){software.author && <> – {software.author}</>} –{" "}
              <i>{software.license}</i>
            </li>
          ))}
        </ul>
      </Card>
    </Page>
  );
}
