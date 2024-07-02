import { faDownload, faFlagCheckered, faHand, faPersonRunning, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import MenuItem from "./MenuItem";

const menuItems: Array<{
    url: string;
    label: string;
    icon: React.ReactElement;
}> = [
    {
        url: "/admin/runners",
        label: "Gestion des coureurs",
        icon: <FontAwesomeIcon icon={faPersonRunning} />,
    },
    {
        url: "/admin/races",
        label: "Gestion des courses",
        icon: <FontAwesomeIcon icon={faFlagCheckered} />,
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

export default function MenuList(): React.ReactElement {
    return (
        <ul className="admin-list">
            {menuItems.map(({ url, icon, label }, key) => <MenuItem key={key} url={url} icon={icon} label={label} />)}
        </ul>
    );
}
