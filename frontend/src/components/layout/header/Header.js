import AdminHeader from "./AdminHeader";
import Navbar from "./Navbar";
import HeaderTimer from "./HeaderTimer";
import {app} from "../../App";
import HeaderFetchLoader from "./HeaderFetchLoader";

const Header = () => {
    return(
        <header id="app-header">
            {app.state.user &&
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

                {!app.state.isLoading &&
                <HeaderTimer />
                }
            </div>
        </header>
    )
}

export default Header;
