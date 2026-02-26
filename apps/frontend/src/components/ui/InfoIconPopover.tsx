import type React from "react";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

interface InfoIconPopoverProps {
  popoverText: string;
}

export default function InfoIconPopover({ popoverText }: InfoIconPopoverProps): React.ReactElement {
  return (
    <Popover>
      <PopoverTrigger openOnHover={true} delay={0}>
        <FontAwesomeIcon icon={faCircleInfo} style={{ opacity: 0.6 }} />
      </PopoverTrigger>

      <PopoverContent>{popoverText}</PopoverContent>
    </Popover>
  );
}
