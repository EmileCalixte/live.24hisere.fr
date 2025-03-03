import type React from "react";
import { useCallback, useContext, useEffect, useRef } from "react";
import { appContext } from "../../../contexts/AppContext";

interface AdminHeaderUserDropdownProps {
  hideDropdown: () => void;
}

export default function AdminHeaderUserDropdown({ hideDropdown }: AdminHeaderUserDropdownProps): React.ReactElement {
  const { logout } = useContext(appContext).user;

  const dropdownNode = useRef<HTMLDivElement>(null);

  const onClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!dropdownNode.current) {
        return;
      }

      if (!dropdownNode.current.contains(e.target as Node)) {
        hideDropdown();
      }
    },
    [dropdownNode, hideDropdown],
  );

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
