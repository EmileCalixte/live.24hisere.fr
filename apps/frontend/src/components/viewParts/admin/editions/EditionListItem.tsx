import type React from "react";
import { faEye, faEyeSlash, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AdminEditionWithRaceCount } from "@live24hisere/core/types";
import AdminListItem from "../../../ui/lists/AdminListItem";

interface EditionListItemProps
  extends Pick<React.ComponentProps<typeof AdminListItem>, "isSorting" | "isDragged" | "isDraggedOver"> {
  edition: AdminEditionWithRaceCount;
}

export default function EditionListItem({ edition, ...props }: EditionListItemProps): React.ReactElement {
  return (
    <AdminListItem
      link={`/admin/editions/${edition.id}`}
      label={edition.name}
      secondaryIcons={[
        [<FontAwesomeIcon className="me-1" icon={faFlagCheckered} key={0} />, edition.raceCount],
        [edition.isPublic ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />],
      ]}
      {...props}
    />
  );
}
