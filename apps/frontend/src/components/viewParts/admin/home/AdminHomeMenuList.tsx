import type React from "react";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faDownload, faFlagCheckered, faHand, faPersonRunning, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuList } from "../../../ui/lists/MenuList/MenuList";
import MenuListItem from "../../../ui/lists/MenuList/MenuListItem";

const menuItems: Array<{
  url: string;
  label: string;
  icon: React.ReactElement;
}> = [
  {
    url: "/admin/editions",
    label: "Gestion des éditions",
    icon: <FontAwesomeIcon icon={faCalendar} />,
  },
  {
    url: "/admin/races",
    label: "Gestion des courses",
    icon: <FontAwesomeIcon icon={faFlagCheckered} />,
  },
  {
    url: "/admin/runners",
    label: "Gestion des coureurs",
    icon: <FontAwesomeIcon icon={faPersonRunning} />,
  },
  {
    url: "/admin/fastest-laps",
    label: "Tours les plus rapides",
    icon: <FontAwesomeIcon icon={faStopwatch} />,
  },
  {
    url: "/admin/passage-import-settings",
    label: "Paramètres d'import des passages",
    icon: <FontAwesomeIcon icon={faDownload} />,
  },
  {
    url: "/admin/disabled-app",
    label: "Désactivation de l'accès à l'application",
    icon: <FontAwesomeIcon icon={faHand} />,
  },
];

export default function AdminHomeMenuList(): React.ReactElement {
  return (
    <MenuList>
      {menuItems.map(({ url, icon, label }, key) => (
        <MenuListItem key={key} link={url} icon={icon} label={label} />
      ))}
    </MenuList>
  );
}
