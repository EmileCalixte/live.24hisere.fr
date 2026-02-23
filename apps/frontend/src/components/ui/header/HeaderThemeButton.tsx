import React from "react";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdSunny } from "react-icons/md";
import { TrackedEvent } from "../../../constants/eventTracking/customEventNames";
import { Theme } from "../../../constants/theme";
import { appContext } from "../../../contexts/AppContext";
import { trackEvent } from "../../../utils/eventTracking/eventTrackingUtils";

export function HeaderThemeButton(): React.ReactElement {
  const {
    theme: { theme, setTheme },
  } = React.useContext(appContext);

  const onClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (theme === Theme.DARK) {
      trackEvent(TrackedEvent.MANUAL_SWITCH_LIGHT_THEME);
    } else {
      trackEvent(TrackedEvent.MANUAL_SWITCH_DARK_THEME);
    }

    setTheme((current) => (current === Theme.DARK ? Theme.LIGHT : Theme.DARK));
  };

  return (
    <button
      className="flex cursor-pointer items-center p-2"
      onClick={onClick}
      aria-label={`Utiliser le thème ${theme === Theme.DARK ? "clair" : "sombre"}`}
    >
      {theme === Theme.DARK && <FontAwesomeIcon icon={faMoon} />}

      {theme === Theme.LIGHT && <MdSunny className="translate-x-0.5 text-xl" />}
    </button>
  );
}
