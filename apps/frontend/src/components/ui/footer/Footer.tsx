import type React from "react";
import { useContext } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatDateAsString } from "../../../utils/utils";
import { appContext } from "../../App";

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

            <p>
              Application développée pour Les 24 Heures de l'Isère par Emile Calixte, avec l'aide de Djeson
              Pascal-Valette
            </p>

            <p>
              <a href="https://github.com/EmileCalixte/live.24hisere.fr" target="_blank" rel="noopener noreferrer">
                Code source
              </a>{" "}
              –{" "}
              <a href="https://www.24hisere.fr/" target="_blank" rel="noopener noreferrer">
                Les 24 Heures de l'Isère
              </a>
            </p>

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
