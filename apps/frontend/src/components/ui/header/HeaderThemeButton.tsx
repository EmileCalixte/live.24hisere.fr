import React from "react";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdSunny } from "react-icons/md";
import { Theme } from "../../../constants/theme";
import { appContext } from "../../../contexts/AppContext";

export function HeaderThemeButton(): React.ReactElement {
  const {
    theme: { theme, setTheme },
  } = React.useContext(appContext);

  return (
    <button
      className="flex cursor-pointer items-center p-2"
      onClick={() => {
        setTheme((current) => (current === Theme.DARK ? Theme.LIGHT : Theme.DARK));
      }}
    >
      {theme === Theme.DARK && <FontAwesomeIcon icon={faMoon} />}

      {theme === Theme.LIGHT && <MdSunny className="translate-x-1 text-xl" />}
    </button>
  );
}
