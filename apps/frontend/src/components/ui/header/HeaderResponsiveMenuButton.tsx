import React from "react";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { navMenuContext } from "../../../contexts/NavMenuContext";

export function HeaderResponsiveMenuButton(): React.ReactElement {
  const { showResponsiveNavMenu, setShowResponsiveNavMenu } = React.useContext(navMenuContext);

  const onClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setShowResponsiveNavMenu((show) => !show);
  };

  return (
    <button className="-ml-2 flex cursor-pointer items-center p-2" onClick={onClick}>
      {showResponsiveNavMenu ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
    </button>
  );
}
