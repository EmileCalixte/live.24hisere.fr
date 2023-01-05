import React, {useEffect, useRef} from "react";

const RunnerDetailsPassageTimeForm: React.FunctionComponent<{
    onClose: () => any,
}> = ({onClose}) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        dialogRef.current?.showModal();
    }, [dialogRef]);

    return (
        <dialog ref={dialogRef} className="modal runner-passage-time-modal">
            <button onClick={() => onClose()}>Close</button>
            <p>TODO</p>
        </dialog>
    );
}

export default RunnerDetailsPassageTimeForm;
