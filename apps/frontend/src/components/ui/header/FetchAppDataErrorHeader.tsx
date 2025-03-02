import type React from "react";

export default function FetchAppDataErrorHeader(): React.ReactElement {
  return (
    <div
      id="app-header-error-section"
      className="bg-red-400 px-3 py-1 text-red-950 md:px-5 dark:bg-red-900 dark:text-red-200"
    >
      <p>
        Une erreur de communication avec le serveur est survenue. Veuillez patienter ou rafraichir cette page si le
        problème persiste pendant plusieurs minutes.
      </p>
    </div>
  );
}
