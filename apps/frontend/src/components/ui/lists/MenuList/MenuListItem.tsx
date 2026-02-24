import React from "react";
import { faGrip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "tailwind-variants";
import { Link } from "../../Link";

interface MenuListItemProps {
  link: string;
  label: string;
  icon?: React.ReactNode;
  secondaryElements?: React.ReactNode[][];
  isSorting?: boolean;
  isDragged?: boolean;
  isDraggedOver?: boolean;
}

export default function MenuListItem({
  link,
  label,
  icon,
  secondaryElements,
  isSorting = false,
  isDragged = false,
  isDraggedOver = false,
}: MenuListItemProps): React.ReactElement {
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
      className={cn(
        isDragged && "dragged opacity-50",
        isDraggedOver && "dragged-over outline",
        "flex gap-5 rounded-md px-4 py-2 text-xl font-bold no-underline",
        "bg-white dark:bg-neutral-800 dark:hover:bg-neutral-700",
        "text-app-green-600",
        "border border-neutral-300 dark:border-neutral-600",
        "shadow-sm transition-shadow hover:shadow-md dark:transition-colors",
        isSorting && "cursor-grab!",
      )}
    >
      {isSorting && (
        <div className="opacity-75">
          <FontAwesomeIcon icon={faGrip} />
        </div>
      )}

      {icon && <span>{icon}</span>}

      <span>{label}</span>

      {secondaryElements && secondaryElements.length > 0 && (
        <span className="flex grow-1 items-end justify-end gap-3 text-sm">
          {secondaryElements.map((iconGroup, iconGroupIndex) => (
            <span key={iconGroupIndex}>
              {iconGroup.map((icon, iconIndex) => (
                <span key={iconIndex}>{icon}</span>
              ))}
            </span>
          ))}
        </span>
      )}
    </Link>
  );
}
