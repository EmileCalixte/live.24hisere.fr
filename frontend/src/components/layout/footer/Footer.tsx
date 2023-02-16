import {useContext} from "react";
import {lastUpdateTimeContext, userContext} from "../../App";
import Util from "../../../util/Util";
import {Link} from "react-router-dom";

const Footer = () => {
    const {lastUpdateTime} = useContext(lastUpdateTimeContext);
    const {user} = useContext(userContext);

    return (
        <footer id="app-footer">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12" style={{textAlign: 'center'}}>
                        <p>Dernière mise à jour des données : {Util.formatDateAsString(lastUpdateTime)}</p>

                        <p>Toutes les données disponibles sur cette page sont extraites du système de chronométrage. Toutefois, ayant un but purement indicatif, les caclculs peuvent éventuellement contenir des erreurs ou des imprécisions. Seules les données du poste de chronométrage font foi.</p>

                        <p>Application développée pour Les 24 Heures de l'Isère par Emile Calixte, avec l'aide de Djeson Pascal-Valette</p>

                        <p>
                            <a href="https://github.com/EmileCalixte/live.24hisere.fr" target="_blank" rel="noopener noreferrer">Code source</a> – <a href="https://www.24hisere.fr/" target="_blank" rel="noopener noreferrer">Les 24 Heures de l'Isère</a>
                        </p>

                        {!user &&
                        <p>
                            <Link to="/login">Connexion admin</Link>
                        </p>
                        }
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
