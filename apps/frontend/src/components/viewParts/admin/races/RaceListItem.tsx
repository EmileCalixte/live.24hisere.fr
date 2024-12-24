import type React from "react";
import { faEye, faEyeSlash, faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import AdminListItem from "../../../ui/lists/AdminListItem";
import RaceTimer from "../../RaceTimer";

interface RaceListItemProps
  extends Pick<React.ComponentProps<typeof AdminListItem>, "isSorting" | "isDragged" | "isDraggedOver"> {
  race: AdminRaceWithRunnerCount;
}

export default function RaceListItem({ race, ...props }: RaceListItemProps): React.ReactElement {
  return (
    <AdminListItem
      link={`/admin/races/${race.id}`}
      label={race.name}
      secondaryIcons={[
        [<FontAwesomeIcon icon={faPersonRunning} key={0} />, race.runnerCount],
        [race.isPublic ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />],
        [<RaceTimer race={race} allowNegative={true} key={0} />],
      ]}
      {...props}
    />
  );
}
