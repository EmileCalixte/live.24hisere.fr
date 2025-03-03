import type React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { appContext } from "../../../contexts/AppContext";
import { formatDateAsString } from "../../../utils/utils";
import LinkBlank from "../LinkBlank";

export default function Footer(): React.ReactElement {
  const {
    appData: { lastUpdateTime, isAppEnabled },
    user: { user },
  } = useContext(appContext);

  return (
    <footer
      id="app-footer"
      className="flex flex-col gap-3 border-t border-transparent bg-neutral-950 px-3 py-3 text-center text-sm text-neutral-50 md:px-5 dark:border-neutral-600"
    >
      {(isAppEnabled || user) && <p>Dernière mise à jour des données : {formatDateAsString(lastUpdateTime)}</p>}

      <p>
        Toutes les données disponibles sur cette application sont extraites du système de chronométrage. Toutefois,
        ayant un but purement indicatif, les calculs peuvent éventuellement contenir des erreurs ou des imprécisions.
        Seules les données du poste de chronométrage font foi.
      </p>

      <ul className="footer-links">
        <li>
          <Link to="/about">À propos</Link>
        </li>
        <li>
          <LinkBlank to="https://github.com/EmileCalixte/live.24hisere.fr">Code source</LinkBlank>
        </li>
        <li>
          <LinkBlank to="https://www.24hisere.fr">Les 24 Heures de l'Isère</LinkBlank>
        </li>
      </ul>

      {!user && (
        <p>
          <Link to="/login">Connexion admin</Link>
        </p>
      )}
    </footer>
  );
}
