import { faFlagCheckered, faPersonRunning, faStopwatch } from "@fortawesome/free-solid-svg-icons";
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
];

export default function MenuList(): React.ReactElement {
    return (
        <ul className="admin-list">
            {menuItems.map(({ url, icon, label }, key) => <MenuItem key={key} url={url} icon={icon} label={label} />)}
        </ul>
    );
}