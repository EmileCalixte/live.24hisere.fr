import {Link} from "react-router-dom";
import React from "react";

const Crumb: React.FunctionComponent<{
    label: string,
    url?: string,
}> = ({label, url}) => {
    if (url) {
        return (
            <li className="crumb">
                <Link to={url}>{label}</Link>
            </li>
        )
    }

    return (
        <li className="crumb">
            <span>{label}</span>
        </li>
    )
}

export default Crumb;
