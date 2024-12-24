import type React from "react";
import { faArrowsUpDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";

interface SortListButtonsProps {
  isSorting: boolean;
  setIsSorting: (isSorting: boolean) => void;
  saveSort: () => void;
  disabled: boolean;
  className?: string;
}

export default function SortListButtons({
  isSorting,
  setIsSorting,
  saveSort,
  disabled,
  className,
}: SortListButtonsProps): React.ReactElement {
  return (
    <Row className={className}>
      <Col className="d-flex gap-2">
        {!isSorting && (
          <button
            className="button"
            onClick={() => {
              setIsSorting(true);
            }}
          >
            <FontAwesomeIcon icon={faArrowsUpDown} className="me-2" />
            Changer l'ordre
          </button>
        )}

        {isSorting && (
          <>
            <button
              className="button red"
              onClick={() => {
                setIsSorting(false);
              }}
              disabled={disabled}
            >
              Annuler
            </button>
            <button
              className="button"
              onClick={() => {
                saveSort();
              }}
              disabled={disabled}
            >
              <FontAwesomeIcon icon={faCheck} className="me-2" />
              Enregistrer
            </button>
          </>
        )}
      </Col>
    </Row>
  );
}
