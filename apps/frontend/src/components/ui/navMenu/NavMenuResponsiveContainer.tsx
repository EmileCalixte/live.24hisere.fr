import React from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import { navMenuContext } from "../../../contexts/NavMenuContext";
import { Drawer, DrawerClose, DrawerContent } from "../Drawer";
import { NavMenu } from "./NavMenu";

export function NavMenuResponsiveContainer(): React.ReactElement {
  const { showResponsiveNavMenu, setShowResponsiveNavMenu } = React.useContext(navMenuContext);
  const location = useLocation();

  React.useEffect(() => {
    setShowResponsiveNavMenu(false);
  }, [location, setShowResponsiveNavMenu]);

  return (
    <Drawer
      swipeDirection="left"
      open={showResponsiveNavMenu}
      onOpenChange={(open) => {
        setShowResponsiveNavMenu(open);
      }}
    >
      <DrawerContent openDirection="left">
        <div className="align-center flex h-16 justify-end px-5">
          <DrawerClose className="-mr-2 flex cursor-pointer items-center p-2">
            <FontAwesomeIcon icon={faXmark} />
          </DrawerClose>
        </div>

        <div className="overflow-x-hidden px-4">
          <NavMenu />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
