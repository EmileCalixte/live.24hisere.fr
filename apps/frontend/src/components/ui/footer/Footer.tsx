import type React from "react";
import { useContext } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatDateAsString } from "../../../utils/utils";
import { appContext } from "../../App";
import LinkBlank from "../LinkBlank";

export default function Footer(): React.ReactElement {
  const {
    appData: { lastUpdateTime, isAppEnabled },
    user: { user },
  } = useContext(appContext);

  return (
    <footer id="app-footer">
      <div className="container-fluid">
        <Row>
          <Col style={{ textAlign: "center" }}>
            {(isAppEnabled || user) && <p>Dernière mise à jour des données : {formatDateAsString(lastUpdateTime)}</p>}

            <p>
              Toutes les données disponibles sur cette application sont extraites du système de chronométrage.
              Toutefois, ayant un but purement indicatif, les calculs peuvent éventuellement contenir des erreurs ou des
              imprécisions. Seules les données du poste de chronométrage font foi.
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
          </Col>
        </Row>
      </div>
    </footer>
  );
}
