import {Link} from "react-router-dom";

interface CrumbProps {
    label: string;
    url?: string;
}

export default function Crumb({label, url}: CrumbProps) {
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
