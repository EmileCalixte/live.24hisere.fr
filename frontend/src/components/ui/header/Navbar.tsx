import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { userContext } from "../../App";

export default function Navbar(): JSX.Element {
    const { user } = useContext(userContext);

    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/ranking">Classements</NavLink>
                </li>

                <li>
                    <NavLink to="/runner-details">Détails coureur</NavLink>
                </li>

                {user &&
                    <li>
                        <NavLink to="/admin">Admin</NavLink>
                    </li>
                }
            </ul>
        </nav>
    );
}
