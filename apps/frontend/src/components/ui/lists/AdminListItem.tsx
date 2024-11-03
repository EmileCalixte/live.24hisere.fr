import React from "react";
import { faGrip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface AdminListItemProps {
  link: string;
  label: string;
  secondaryIcons: React.ReactNode[][];
  isSorting: boolean;
  isDragged: boolean;
  isDraggedOver: boolean;
}

export default function AdminListItem({
  link,
  label,
  secondaryIcons,
  isSorting,
  isDragged,
  isDraggedOver,
}: AdminListItemProps): React.ReactElement {
  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Prevent navigation to the clicked race if sorting mode is enabled
      if (isSorting) {
        e.preventDefault();
      }
    },
    [isSorting],
  );

  return (
    <Link
      to={link}
      onClick={onClick}
      className={`${isDragged ? "dragged" : ""} ${isDraggedOver ? "dragged-over" : ""}`}
    >
      {isSorting && (
        <div className="admin-list-link-drag-icon">
          <FontAwesomeIcon icon={faGrip} />
        </div>
      )}

      <div className="admin-list-link-label">{label}</div>

      {secondaryIcons && secondaryIcons.length > 0 && (
        <div className="admin-list-link-secondary-icons">
          {secondaryIcons.map((iconGroup, iconGroupIndex) => (
            <div className="admin-list-link-secondary-icon-group" key={iconGroupIndex}>
              {iconGroup.map((icon, iconIndex) => (
                <span key={iconIndex}>{icon}</span>
              ))}
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
