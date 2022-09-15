import {Link} from "react-router-dom";
import MenuItem from "./MenuItem";

const menuItems = [
    {
        url: "/admin/runners",
        icon: "fa-solid fa-person-running",
        label: "Gestion des coureurs",
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
            {menuItems.map(({url, icon, label}) => <MenuItem url={url} icon={icon} label={label} />)}
        </ul>
    )
}

export default MenuList;
