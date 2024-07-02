import React, { useContext } from "react";
import AdminHeader from "./AdminHeader";
import FetchAppDataErrorHeader from "./FetchAppDataErrorHeader";
import Navbar from "./Navbar";
import { appContext } from "../../App";
import HeaderFetchLoader from "./HeaderFetchLoader";

export default function Header(): React.ReactElement {
    const {
        user: { user },
        headerFetchLoader: { fetchLevel },
        appData: { fetchError, isAppEnabled },
    } = useContext(appContext);

    return (
        <header id="app-header">
            {user && <AdminHeader />}

            <div id="app-header-main-section">
                <div id="app-header-logo-container">
                    <img alt="Logo" src="/img/24hisere.svg" />
                </div>

                {(isAppEnabled || user) && (
                    <Navbar />
                )}

                <div className="flex-grow-1" />

                {fetchLevel > 0 && <HeaderFetchLoader />}
            </div>

            {!!fetchError && <FetchAppDataErrorHeader />}
        </header>
    );
}
