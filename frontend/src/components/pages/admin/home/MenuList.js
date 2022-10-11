import MenuItem from "./MenuItem";

const menuItems = [
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
        url: "/admin/race-settings",
        icon: "fa-solid fa-gear",
        label: "Paramètres de course",
    },
    {
        url: "/admin/users",
        icon: "fa-solid fa-user-shield",
        label: "Gestion des administrateurs",
    },
];

const MenuList = () => {
    return (
        <ul className="admin-home-menu-list">
            {menuItems.map(({url, icon, label}, key) => <MenuItem key={key} url={url} icon={icon} label={label} />)}
        </ul>
    )
}

export default MenuList;
