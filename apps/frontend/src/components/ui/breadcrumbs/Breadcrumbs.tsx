import React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "../Card";

interface BreadcrumbsProps {
  children: React.ReactNode[] | React.ReactNode;
}

export default function Breadcrumbs({ children }: BreadcrumbsProps): React.ReactElement {
  const className = "my-5 flex gap-2 items-baseline";

  if (!Array.isArray(children)) {
    return (
      <Card as="ol" className={className}>
        <span>{children}</span>
      </Card>
    );
  }

  return (
    <Card as="ol" className={className}>
      {children.map((child, key) => {
        const renderSeparator = key <= children.length - 2;

        return (
          <React.Fragment key={key}>
            {child}

            {renderSeparator && (
              <span className="text-[0.7em]">
                <FontAwesomeIcon icon={faChevronRight} />
              </span>
            )}
          </React.Fragment>
        );
      })}
    </Card>
  );
}
