import React from "react";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { PublicUser } from "@live24hisere/core/types";
import { appContext } from "../../../contexts/AppContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../DropdownMenu";

interface AdminHeaderUserDropdownProps {
  user: PublicUser;
}

export default function AdminHeaderUserDropdown({ user }: AdminHeaderUserDropdownProps): React.ReactElement {
  const { logout } = React.useContext(appContext).user;

  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpened}>
      <DropdownMenuTrigger asChild>
        <button className="hover:cursor-pointer">
          {user.username}
          <> </>
          <FontAwesomeIcon icon={isOpened ? faAngleUp : faAngleDown} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-2">
        <DropdownMenuItem onClick={logout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
