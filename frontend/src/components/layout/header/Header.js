import Navbar from "./Navbar";
import HeaderTimer from "./HeaderTimer";
import {app} from "../../App";

const Header = () => {
    return(
        <header id="app-header">
            <div id="app-header-logo-container">
                <img alt="Logo" src="/img/24hisere.svg" />
            </div>
            <Navbar />

            {!app.state.isLoading &&
                <HeaderTimer />
            }
        </header>
    )
}

export default Header;
