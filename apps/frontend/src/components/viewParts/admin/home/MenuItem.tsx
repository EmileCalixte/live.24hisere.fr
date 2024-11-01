import React from "react";
import { Link } from "react-router-dom";

interface MenuItemProps {
  url: string;
  label: string;
  icon: React.ReactElement;
}

export default function MenuItem({ url, label, icon }: MenuItemProps): React.ReactElement {
  return (
    <li>
      <Link to={url}>
        <div className="admin-list-link-icon">{icon}</div>
        <div className="admin-list-link-label">{label}</div>
      </Link>
    </li>
  );
}
