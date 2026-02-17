import React from "react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { appContext } from "../../../contexts/AppContext";

export interface NavMenuItem {
  label: string;
  to: string;
  external?: true;
}

export interface NavMenuCategory {
  title?: string;
  toPrefix?: string;
  items: NavMenuItem[];
  show: boolean;
}

function buildPath(prefix: string | undefined, to: string): string {
  if (!prefix) {
    return to;
  }

  return `${prefix}${to}`;
}

export function NavMenu(): React.ReactElement {
  const { user } = React.useContext(appContext).user;

  const menu = React.useMemo<NavMenuCategory[]>(
    () => [
      {
        title: "Suivi",
        items: [
          { label: "Courses et classements", to: "/races" },
          { label: "Coureurs", to: "/runner-details" },
        ],
        show: true,
      },
      {
        title: "Outils",
        items: [{ label: "Comparer des coureurs", to: "/compare-runners" }],
        show: false,
      },
      {
        title: "Administration",
        toPrefix: "/admin",
        items: [
          { label: "Éditions", to: "/editions" },
          { label: "Courses", to: "/races" },
          { label: "Coureurs", to: "/runners" },
          { label: "Catégories personnalisées", to: "/custom-runner-categories" },
          { label: "Import de passages", to: "/passage-import-rules" },
          { label: "Tours les plus rapides", to: "/fastest-laps" },
          { label: "Désactivation de l'accès à l'application", to: "/disabled-app" },
        ],
        show: !!user,
      },
      {
        title: "Autres liens",
        items: [
          { label: "Les 24 Heures de l'Isère", to: "https://www.24hisere.fr", external: true },
          { label: "Facebook", to: "https://www.facebook.com/24hisere", external: true },
          { label: "Instagram", to: "https://www.instagram.com/24hisere", external: true },
        ],
        show: true,
      },
    ],
    [user],
  );

  return (
    <nav className="pt-2">
      <ul className="flex flex-col gap-5">
        {menu.map((category, index) => (
          <React.Fragment key={index}>
            {category.show && (
              <li key={index} className="flex flex-col gap-1">
                <span className="inline-block pl-3 font-bold">{category.title}</span>
                <ul className="flex flex-col gap-1">
                  {category.items.map((item, index) => (
                    <li key={index}>
                      <NavLink
                        to={buildPath(category.toPrefix, item.to)}
                        className={clsx(
                          "box-border inline-block w-full rounded-sm px-3 py-0.75",
                          "transition",
                          "[&.active]:bg-active-item",
                          "hover:bg-active-item",
                        )}
                        target={item.external ? "_blank" : "_self"}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
}
