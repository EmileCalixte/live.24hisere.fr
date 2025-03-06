import type React from "react";
import { useContext } from "react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { appContext } from "../../../contexts/AppContext";

export default function Navbar(): React.ReactElement {
  const { user } = useContext(appContext).user;

  const links = [
    { to: "/ranking", label: "Classements" },
    { to: "/runner-details", label: "Détails coureur" },
    ...(user ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <nav className="h-full">
      <ul className="h-full">
        {links.map((link) => (
          <li key={link.to} className="inline-block h-full">
            <NavLink
              to={link.to}
              className={clsx(
                "relative mx-0 flex h-full items-center px-[5px] text-sm font-bold !text-neutral-950 !no-underline transition-[color] md:mx-[10px] md:text-base dark:!text-neutral-200",
                "[&.active]:!text-app-green-600",
                "after:border-app-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:border-b-[3px] [&.active]:after:content-[''] [&:not(.active)]:after:border-transparent",
              )}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
