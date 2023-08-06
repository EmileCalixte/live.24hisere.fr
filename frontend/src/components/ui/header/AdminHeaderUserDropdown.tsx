import { userContext } from "../../App";
import { useCallback, useContext, useEffect, useRef } from "react";

interface AdminHeaderUserDropdownProps {
    hideDropdown: () => any;
}

export default function AdminHeaderUserDropdown({ hideDropdown }: AdminHeaderUserDropdownProps): JSX.Element {
    const { logout } = useContext(userContext);

    const dropdownNode = useRef<HTMLDivElement>(null);

    const onClickOutside = useCallback((e: MouseEvent) => {
        if (!dropdownNode?.current) {
            return;
        }

        if (!dropdownNode.current.contains(e.target as Node)) {
            hideDropdown();
        }
    }, [dropdownNode, hideDropdown]);

    useEffect(() => {
        setTimeout(() => {
            document.addEventListener("click", onClickOutside);
        }, 0);

        return () => {
            document.removeEventListener("click", onClickOutside);
        };
    }, [onClickOutside]);

    return (
        <div className="options-dropdown" ref={dropdownNode}>
            <ul>
                <li>
                    <button onClick={logout}>Déconnexion</button>
                </li>
            </ul>
        </div>
    );
}
