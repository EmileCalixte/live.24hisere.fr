import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface BreadcrumbsProps {
    children: React.ReactNode[] | React.ReactNode;
}

export default function Breadcrumbs({ children }: BreadcrumbsProps): React.ReactElement {
    if (!Array.isArray(children)) {
        return (
            <ul className="breadcrumbs">
                <span>{children}</span>
            </ul>
        );
    }

    return (
        <ul className="breadcrumbs">
            {children.map((child, key) => {
                const renderSeparator = key <= children.length - 2;
                return (
                    <span key={key}>
                        {child}

                        {renderSeparator &&
                            <span className="crumb-separator">
                                <FontAwesomeIcon icon={faChevronRight} />
                            </span>
                        }
                    </span>
                );
            })}
        </ul>
    );
}
