import type React from "react";
import { useEffect, useRef } from "react";
import { formatDateAsString } from "../../../../utils/utils";
import { Dialog, DialogContent, DialogTitle } from "../../../ui/Dialog";
import { Button } from "../../../ui/forms/Button";
import DurationInputs from "../../../ui/forms/DurationInputs";

interface RunnerDetailsPassageFormDialogProps {
  raceTime: number;
  setRaceTime: (raceTime: number) => void;
  time: Date | null;
  title: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitButtonDisabled: boolean;
  onClose: () => void;
}

export default function RunnerDetailsPassageFormDialog({
  raceTime,
  setRaceTime,
  time,
  title,
  onSubmit,
  submitButtonDisabled,
  onClose,
}: RunnerDetailsPassageFormDialogProps): React.ReactElement {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (dialogRef.current?.open) {
      return;
    }

    dialogRef.current?.showModal();
  }, [dialogRef]);

  return (
    <Dialog
      // We dont want Radix to handle open/close state for this dialog.
      // If this component is mounted, the dialog should always be shown.
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="flex flex-col gap-3">
        <DialogTitle asChild>
          <h3 className="mt-0">{title}</h3>
        </DialogTitle>

        <form
          onSubmit={(e) => {
            void onSubmit(e);
          }}
          className="flex flex-col gap-3"
        >
          <DurationInputs legend="Temps de course" duration={raceTime} setDuration={setRaceTime} />

          {time && <p>Date et heure : {formatDateAsString(time)}</p>}

          <div className="flex justify-between">
            <div>
              <Button
                color="gray"
                type="button"
                onClick={() => {
                  onClose();
                }}
              >
                Annuler
              </Button>
            </div>

            <div>
              <Button type="submit" disabled={submitButtonDisabled}>
                Enregistrer
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
