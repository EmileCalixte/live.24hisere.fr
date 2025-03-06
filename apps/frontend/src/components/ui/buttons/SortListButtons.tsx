import type React from "react";
import { faArrowsUpDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../forms/Button";

interface SortListButtonsProps {
  isSorting: boolean;
  setIsSorting: (isSorting: boolean) => void;
  saveSort: () => void;
  disabled: boolean;
}

export default function SortListButtons({
  isSorting,
  setIsSorting,
  saveSort,
  disabled,
}: SortListButtonsProps): React.ReactElement {
  return (
    <div className="flex gap-2">
      {!isSorting && (
        <Button
          onClick={() => {
            setIsSorting(true);
          }}
          icon={<FontAwesomeIcon icon={faArrowsUpDown} />}
        >
          Changer l'ordre
        </Button>
      )}

      {isSorting && (
        <>
          <Button
            color="red"
            onClick={() => {
              setIsSorting(false);
            }}
            disabled={disabled}
          >
            Annuler
          </Button>
          <Button
            className="button"
            onClick={() => {
              saveSort();
            }}
            disabled={disabled}
          >
            <FontAwesomeIcon icon={faCheck} className="me-2" />
            Enregistrer
          </Button>
        </>
      )}
    </div>
  );
}
