import React from "react";

export default function FetchAppDataErrorHeader(): React.ReactElement {
  return (
    <div id="app-header-error-section">
      <p className="m-0">
        Une erreur de communication avec le serveur est survenue. Veuillez patienter ou rafraichir cette page si le
        problème persiste pendant plusieurs minutes.
      </p>
    </div>
  );
}
