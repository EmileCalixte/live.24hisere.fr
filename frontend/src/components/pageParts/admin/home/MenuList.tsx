import {faFlagCheckered, faPersonRunning, faStopwatch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MenuItem from "./MenuItem";

const menuItems: {
    url: string;
    label: string;
    icon: JSX.Element;
}[] = [
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

export default function MenuList() {
    return (
        <ul className="admin-list">
            {menuItems.map(({url, icon, label}, key) => <MenuItem key={key} url={url} icon={icon} label={label} />)}
        </ul>
    );
}
