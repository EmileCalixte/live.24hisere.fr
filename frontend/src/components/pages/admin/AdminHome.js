import {Link} from "react-router-dom";

const AdminHome = () => {
    return (
        <div id="page-admin-home">
            <div className="row">
                <div className="col-12">
                    <h1>Administration</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <ul className="admin-home-menu-list">
                        <li>
                            <Link to="/admin/runners">
                                <div className="admin-home-menu-link-icon">
                                    <i className="fa-solid fa-person-running"/>
                                </div>
                                <div className="admin-home-menu-link-label">
                                    Gestion des coureurs
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/users">
                                <div className="admin-home-menu-link-icon">
                                    <i className="fa-solid fa-user-shield"/>
                                </div>
                                <div className="admin-home-menu-link-label">
                                    Gestion des administrateurs
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AdminHome;
