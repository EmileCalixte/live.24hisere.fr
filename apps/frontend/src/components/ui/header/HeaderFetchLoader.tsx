import type React from "react";
import CircularLoader from "../CircularLoader";

export default function HeaderFetchLoader(): React.ReactElement {
  return (
    <div className="flex h-full items-center justify-center p-2">
      <CircularLoader />
    </div>
  );
}
