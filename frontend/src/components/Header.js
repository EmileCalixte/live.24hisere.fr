import React from "react";

class Header extends React.Component {
    render = () => {
        return(
            <header id="app-header">
                <div id="app-header-logo-container">
                    <img alt="Logo" src="/img/24hisere.svg" />
                </div>
                <nav>
                    Nav
                </nav>
            </header>
        )
    }
}

export default Header;
