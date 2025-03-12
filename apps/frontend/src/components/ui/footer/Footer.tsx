import type React from "react";
import { useContext } from "react";
import { appContext } from "../../../contexts/AppContext";
import { formatDateAsString } from "../../../utils/utils";
import { Link } from "../Link";

export default function Footer(): React.ReactElement {
  const {
    appData: { lastUpdateTime, isAppEnabled },
    user: { user },
  } = useContext(appContext);

  return (
    <footer
      id="app-footer"
      className="flex flex-col gap-3 border-t border-transparent bg-neutral-950 px-3 py-3 text-center text-sm text-neutral-50 md:px-5 dark:border-neutral-600 print:hidden"
    >
      {(isAppEnabled || user) && <p>Dernière mise à jour des données : {formatDateAsString(lastUpdateTime)}</p>}

      <p>
        Toutes les données disponibles sur cette application sont extraites du système de chronométrage. Toutefois,
        ayant un but purement indicatif, les calculs peuvent éventuellement contenir des erreurs ou des imprécisions.
        Seules les données du poste de chronométrage font foi.
      </p>

      <ul className="footer-links flex flex-col justify-center gap-4 md:flex-row md:gap-0">
        <li>
          <Link to="/about" className="text-inherit">
            À propos
          </Link>
        </li>
        <li>
          <Link to="https://github.com/EmileCalixte/live.24hisere.fr" className="text-inherit" target="_blank">
            Code source
          </Link>
        </li>
        <li>
          <Link to="https://www.24hisere.fr" className="text-inherit" target="_blank">
            Les 24 Heures de l'Isère
          </Link>
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
