import React from "react";
import { faEye, faEyeSlash, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import type { AdminProcessedPassage, AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import type { ReactStateSetter } from "../../../../types/utils/react";
import { formatMsAsDuration } from "../../../../utils/durationUtils";
import { formatDateAsString } from "../../../../utils/utils";
import { Button } from "../../../ui/forms/Button";
import { Table, Td, Th, Tr } from "../../../ui/Table";
import TruncateText from "../../../ui/text/TruncateText";
import RunnerDetailsCreatePassageDialog from "../runners/RunnerDetailsCreatePassage";
import RunnerDetailsEditPassageDialog from "../runners/RunnerDetailsEditPassage";

interface ParticipantDetailsPassagesProps {
  passages: AdminProcessedPassage[];
  runnerRace: AdminRaceWithRunnerCount | null;
  isAddingPassage: boolean;
  setIsAddingPassage: ReactStateSetter<boolean>;
  updatePassageVisiblity: (passage: AdminProcessedPassage, hidden: boolean) => unknown;
  updatePassage: (passage: AdminProcessedPassage, time: Date, comment: string | null) => unknown;
  saveNewPassage: (time: Date, comment: string | null) => unknown;
  deletePassage: (passage: AdminProcessedPassage) => unknown;
}

export default function ParticipantDetailsPassages({
  passages,
  runnerRace,
  isAddingPassage,
  setIsAddingPassage,
  updatePassageVisiblity,
  updatePassage,
  saveNewPassage,
  deletePassage,
}: ParticipantDetailsPassagesProps): React.ReactElement {
  // The passage for which user is currently editing the time
  const [editingPassage, setEditingPassage] = React.useState<AdminProcessedPassage | null>(null);

  const passageCount = React.useMemo(() => passages.length, [passages]);

  const hiddenPassageCount = React.useMemo(() => passages.filter((passage) => passage.isHidden).length, [passages]);

  return (
    <>
      {isAddingPassage && (
        <RunnerDetailsCreatePassageDialog
          runnerRace={runnerRace}
          savePassage={saveNewPassage}
          onClose={() => {
            setIsAddingPassage(false);
          }}
        />
      )}

      {editingPassage !== null && (
        <RunnerDetailsEditPassageDialog
          passage={editingPassage}
          runnerRace={runnerRace}
          updatePassage={updatePassage}
          onClose={() => {
            setEditingPassage(null);
          }}
        />
      )}

      {passages.length === 0 && (
        <p>
          <i>Aucun passage</i>
        </p>
      )}

      {passages.length > 0 && (
        <>
          <p>
            {passageCount} passage
            {passageCount >= 2 ? "s" : ""}
            {hiddenPassageCount > 0 && `, dont ${hiddenPassageCount} masqué${hiddenPassageCount >= 2 ? "s" : ""}`}
          </p>

          <div>
            <Table>
              <thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Type</Th>
                  <Th>Date et heure</Th>
                  <Th>Temps de course</Th>
                  <Th>Commentaire</Th>
                  <Th colSpan={3}>Actions</Th>
                </Tr>
              </thead>
              <tbody>
                {passages.map((passage) => (
                  <Tr key={passage.id} className={clsx(passage.isHidden && "passage-hidden")}>
                    <Td className="text-xs">{passage.id}</Td>
                    <Td className="text-xs">
                      {(() => {
                        if (passage.detectionId !== null) {
                          let text = `Auto (${passage.detectionId})`;

                          if (passage.importTime !== null) {
                            text = `${text} (${formatDateAsString(new Date(passage.importTime))})`;
                          }

                          return text;
                        }

                        return "Manuel";
                      })()}
                    </Td>
                    <Td className={clsx(passage.isHidden && "line-through")}>
                      {formatDateAsString(passage.processed.lapEndTime)}
                    </Td>
                    <Td className={clsx(passage.isHidden && "line-through")}>
                      {formatMsAsDuration(passage.processed.lapEndRaceTime)}
                    </Td>
                    <Td>{passage.comment && <TruncateText maxLength={50}>{passage.comment}</TruncateText>}</Td>
                    <Td>
                      {passage.isHidden ? (
                        <Button
                          size="sm"
                          icon={<FontAwesomeIcon icon={faEye} />}
                          onClick={() => {
                            void updatePassageVisiblity(passage, false);
                          }}
                        >
                          Ne plus masquer
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          color="orange"
                          icon={<FontAwesomeIcon icon={faEyeSlash} />}
                          onClick={() => {
                            void updatePassageVisiblity(passage, true);
                          }}
                        >
                          Masquer
                        </Button>
                      )}
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        icon={<FontAwesomeIcon icon={faPen} />}
                        onClick={() => {
                          setEditingPassage(passage);
                        }}
                      >
                        Modifier
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        color="red"
                        size="sm"
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        onClick={() => {
                          void deletePassage(passage);
                        }}
                      >
                        Supprimer
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}
