import {NavLink} from "react-router-dom";
import {app} from "../../App";

const Navbar = () => {
    return(
        <nav>
            <ul>
                <li>
                    <NavLink to="/ranking">Classements</NavLink>
                </li>
                <li>
                    <NavLink to="/runner-details">Détails coureur</NavLink>
                </li>
                {app.state.user &&
                <li>
                    <NavLink to="/admin">Admin</NavLink>
                </li>
                }
            </ul>
        </nav>
    )
}

export default Navbar;
