import React from "react";
import CircularLoader from "../CircularLoader";

export default function HeaderFetchLoader(): React.ReactElement {
  return (
    <div className="header-fetch-loader-container">
      <CircularLoader />
    </div>
  );
}
