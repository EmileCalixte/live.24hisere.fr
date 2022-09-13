import {app} from "../../App";
import {useEffect, useRef} from "react";

const AdminHeaderUserDropdown = ({hideDropdown}) => {
    const dropdownNode = useRef();

    const onClickOutside = (e) => {
        if (!dropdownNode.current.contains(e.target)) {
            hideDropdown();
        }
    }

    useEffect(() => {
        setTimeout(() => {
            document.addEventListener('click', onClickOutside);
        }, 0)

        return () => {
            document.removeEventListener('click', onClickOutside);
        }
    }, []);

    return (
        <div className="options-dropdown" ref={dropdownNode}>
            <ul>
                <li>
                    <button onClick={app.logout}>Déconnexion</button>
                </li>
            </ul>
        </div>
    )
}

export default AdminHeaderUserDropdown;
