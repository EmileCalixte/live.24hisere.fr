import CircularLoader from "../CircularLoader";

export default function HeaderFetchLoader(): JSX.Element {
    return (
        <div className="header-fetch-loader-container">
            <CircularLoader />
        </div>
    );
}
