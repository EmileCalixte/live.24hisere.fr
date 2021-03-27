import React from "react";
import {NavLink} from "react-router-dom";

class Navbar extends React.Component {
    render = () => {
        return(
            <nav>
                <ul>
                    <li>
                        <NavLink to="/ranking">Classements</NavLink>
                    </li>
                    <li>
                        <NavLink to="/runner-details">Détails coureur</NavLink>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;
