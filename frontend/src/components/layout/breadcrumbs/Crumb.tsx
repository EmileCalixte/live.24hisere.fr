import {Link} from "react-router-dom";
import {type FunctionComponent} from "react";

interface CrumbProps {
    label: string;
    url?: string;
}

const Crumb: FunctionComponent<CrumbProps> = ({label, url}) => {
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
};

export default Crumb;
