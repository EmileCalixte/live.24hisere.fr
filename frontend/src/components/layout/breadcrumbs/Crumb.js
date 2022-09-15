import {Link} from "react-router-dom";

const Crumb = ({label, url}) => {
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
