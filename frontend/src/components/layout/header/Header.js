import Navbar from "./Navbar";

const Header = () => {
    return(
        <header id="app-header">
            <div id="app-header-logo-container">
                <img alt="Logo" src="/img/24hisere.svg" />
            </div>
            <Navbar />
        </header>
    )
}

export default Header;
