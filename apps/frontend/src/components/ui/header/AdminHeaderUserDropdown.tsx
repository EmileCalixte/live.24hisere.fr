import React from "react";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { PublicUser } from "@live24hisere/core/types";
import { userContext } from "../../../contexts/UserContext";
import { DropdownMenu, DropdownMenuItem, DropdownMenuPopup, DropdownMenuTrigger } from "../DropdownMenu";

interface AdminHeaderUserDropdownProps {
  user: PublicUser;
}

export default function AdminHeaderUserDropdown({ user }: AdminHeaderUserDropdownProps): React.ReactElement {
  const { logout } = React.useContext(userContext);

  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpened}>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 hover:cursor-pointer">
        {user.username}
        <FontAwesomeIcon icon={isOpened ? faAngleUp : faAngleDown} />
      </DropdownMenuTrigger>

      <DropdownMenuPopup className="mr-2">
        <DropdownMenuItem onClick={logout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuPopup>
    </DropdownMenu>
  );
}
