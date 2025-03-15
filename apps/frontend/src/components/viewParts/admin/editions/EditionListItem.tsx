import type React from "react";
import { faEye, faEyeSlash, faFlagCheckered, faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AdminEditionWithRaceAndRunnerCount } from "@live24hisere/core/types";
import MenuListItem from "../../../ui/lists/MenuList/MenuListItem";

interface EditionListItemProps
  extends Pick<React.ComponentProps<typeof MenuListItem>, "isSorting" | "isDragged" | "isDraggedOver"> {
  edition: AdminEditionWithRaceAndRunnerCount;
}

export default function EditionListItem({ edition, ...props }: EditionListItemProps): React.ReactElement {
  return (
    <MenuListItem
      link={`/admin/editions/${edition.id}`}
      label={edition.name}
      secondaryElements={[
        [<FontAwesomeIcon className="me-1" icon={faFlagCheckered} key={0} />, edition.raceCount],
        [<FontAwesomeIcon icon={faPersonRunning} key={0} />, edition.runnerCount],
        [edition.isPublic ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />],
      ]}
      {...props}
    />
  );
}
