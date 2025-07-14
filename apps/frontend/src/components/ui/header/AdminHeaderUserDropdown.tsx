import React from "react";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { PublicUser } from "@live24hisere/core/types";
import { appContext } from "../../../contexts/AppContext";
import { DropdownMenu, DropdownMenuItem, DropdownMenuPopup, DropdownMenuTrigger } from "../DropdownMenu";

interface AdminHeaderUserDropdownProps {
  user: PublicUser;
}

export default function AdminHeaderUserDropdown({ user }: AdminHeaderUserDropdownProps): React.ReactElement {
  const { logout } = React.useContext(appContext).user;

  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpened}>
      <DropdownMenuTrigger
        render={
          <button className="inline-flex items-center gap-1 hover:cursor-pointer">
            {user.username}
            <FontAwesomeIcon icon={isOpened ? faAngleUp : faAngleDown} />
          </button>
        }
      />

      <DropdownMenuPopup className="mr-2">
        <DropdownMenuItem onClick={logout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuPopup>
    </DropdownMenu>
  );
}
