import React from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { navMenuContext } from "../../../contexts/NavMenuContext";

export function HeaderResponsiveMenuButton(): React.ReactElement {
  const { setShowResponsiveNavMenu } = React.useContext(navMenuContext);

  const onClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setShowResponsiveNavMenu((show) => !show);
  };

  return (
    <button
      className="-ml-2 flex cursor-pointer items-center p-2"
      onClick={onClick}
      aria-label="Afficher le menu de navigation"
    >
      <FontAwesomeIcon icon={faBars} />
    </button>
  );
}
