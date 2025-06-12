import { MdFemale, MdMale } from "react-icons/md";
import { GENDER } from "@live24hisere/core/constants";
import type { Gender } from "@live24hisere/core/types";

interface GenderIconProps {
  gender: Gender;
}

export default function GenderIcon({ gender }: GenderIconProps): React.ReactElement {
  if (gender === GENDER.M) {
    return <MdMale className="text-blue-800 dark:text-blue-400" />;
  }

  return <MdFemale className="text-red-800 dark:text-red-400" />;
}
