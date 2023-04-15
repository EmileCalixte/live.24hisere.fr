import MenuItem from "./MenuItem";

const menuItems: {
    url: string;
    icon: string;
    label: string;
}[] = [
    {
        url: "/admin/runners",
        icon: "fa-solid fa-person-running",
        label: "Gestion des coureurs",
    },
    {
        url: "/admin/races",
        icon: "fa-sharp fa-solid fa-flag-checkered",
        label: "Gestion des courses",
    },
    {
        url: "/admin/fastest-laps",
        icon: "fa-solid fa-stopwatch",
        label: "Tours les plus rapides",
    },
];

export default function MenuList() {
    return (
        <ul className="admin-list">
            {menuItems.map(({url, icon, label}, key) => <MenuItem key={key} url={url} icon={icon} label={label} />)}
        </ul>
    );
}
