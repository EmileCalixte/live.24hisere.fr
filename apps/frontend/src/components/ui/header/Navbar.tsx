import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { appContext } from "../../App";

export default function Navbar(): React.ReactElement {
  const { user } = useContext(appContext).user;

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/ranking">Classements</NavLink>
        </li>

        <li>
          <NavLink to="/runner-details">Détails coureur</NavLink>
        </li>

        {user && (
          <li>
            <NavLink to="/admin">Admin</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
