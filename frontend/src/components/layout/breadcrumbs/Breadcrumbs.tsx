import React from "react";

const Breadcrumbs: React.FunctionComponent<{children: React.ReactNode[] | React.ReactNode}> = ({children}) => {
    if (!Array.isArray(children)) {
        return (
            <ul className="breadcrumbs">
                <span>{children}</span>
            </ul>
        )
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
                            <i className="fa-solid fa-chevron-right"/>
                        </span>
                        }
                    </span>
                )
            })}
        </ul>
    )
}

export default Breadcrumbs;
