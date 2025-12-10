import type React from "react";
import { faEye, faEyeSlash, faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import MenuListItem from "../../../ui/lists/MenuList/MenuListItem";
import RaceTimer from "../../RaceTimer";

interface RaceListItemProps extends Pick<
  React.ComponentProps<typeof MenuListItem>,
  "isSorting" | "isDragged" | "isDraggedOver"
> {
  race: AdminRaceWithRunnerCount;
}

export default function RaceListItem({ race, ...props }: RaceListItemProps): React.ReactElement {
  return (
    <MenuListItem
      link={`/admin/races/${race.id}`}
      label={race.name}
      secondaryElements={[
        [<FontAwesomeIcon icon={faPersonRunning} key={0} />, race.runnerCount],
        [race.isPublic ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />],
        [<RaceTimer race={race} allowNegative={true} key={0} />],
      ]}
      {...props}
    />
  );
}
