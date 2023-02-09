import {useContext} from "react";
import AdminHeader from "./AdminHeader";
import Navbar from "./Navbar";
import {app, userContext} from "../../App";
import HeaderFetchLoader from "./HeaderFetchLoader";

const Header = () => {
    const {user} = useContext(userContext);

    return (
        <header id="app-header">
            {user &&
            <AdminHeader />
            }
            <div id="app-header-main-section">
                <div id="app-header-logo-container">
                    <img alt="Logo" src="/img/24hisere.svg" />
                </div>
                <Navbar />

                {app.state.isFetching &&
                <HeaderFetchLoader />
                }
            </div>
        </header>
    )
}

export default Header;
