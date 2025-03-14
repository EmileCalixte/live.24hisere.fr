import type React from "react";
import { Link } from "../Link";

export interface CrumbProps {
  label: string;
  url?: string;
}

export default function Crumb({ label, url }: CrumbProps): React.ReactElement {
  if (url) {
    return (
      <li className="crumb">
        <Link to={url}>{label}</Link>
      </li>
    );
  }

  return (
    <li className="crumb">
      <span>{label}</span>
    </li>
  );
}
