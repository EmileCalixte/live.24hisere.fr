import type React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "./ui/Link";

type ComplexPageTitleProps = React.PropsWithChildren<{
  createButtonUrl?: string;
}>;

export default function ComplexPageTitle({ createButtonUrl, children }: ComplexPageTitleProps): React.ReactElement {
  if (!createButtonUrl) {
    return <>children</>;
  }

  return (
    <span className="flex flex-wrap items-center gap-5">
      {children}
      <span className="text-base">
        <Link variant="button" to={createButtonUrl} icon={<FontAwesomeIcon icon={faPlus} />}>
          Créer
        </Link>
      </span>
    </span>
  );
}
