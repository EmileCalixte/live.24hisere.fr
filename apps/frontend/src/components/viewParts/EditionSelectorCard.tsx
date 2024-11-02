import React from "react";
import clsx from "clsx";
import { Col, Row } from "react-bootstrap";
import { type PublicEdition } from "@live24hisere/core/types";
import { type SelectOption } from "../../types/Forms";
import Select from "../ui/forms/Select";

interface EditionSelectorCardProps {
  editions: PublicEdition[];
  selectedEditionId: number | undefined;
  className?: string;
}

export default function EditionSelectorCard({
  editions,
  selectedEditionId,
  className,
}: EditionSelectorCardProps): React.ReactElement {
  const editionOptions = React.useMemo<Array<SelectOption<number>>>(() => {
    if (!editions) {
      return [];
    }

    return editions.map((edition) => ({
      label: edition.name,
      value: edition.id,
    }));
  }, [editions]);

  return (
    <div className={clsx("card", className)}>
      <Row>
        <Col xl={3} lg={4} md={6} sm={9} xs={12}>
          <Select label="Édition" options={editionOptions} value={selectedEditionId} />
        </Col>
      </Row>
    </div>
  );
}
