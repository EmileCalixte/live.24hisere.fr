import React, {useEffect, useRef} from "react";
import {AdminProcessedPassage} from "../../../../types/Passage";

const RunnerDetailsPassageTimeForm: React.FunctionComponent<{
    passage: AdminProcessedPassage,
    onClose: () => any,
}> = ({passage, onClose}) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        dialogRef.current?.showModal();
    }, [dialogRef]);

    return (
        <dialog ref={dialogRef} className="modal runner-passage-time-modal">
            <button className="close-button" onClick={() => onClose()}>
                <i className="fa-solid fa-xmark"/>
            </button>

            <div className="row">
                <div className="col-12">
                    <h3 className="mt-0">Modification passage #{passage.id}</h3>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    TODO
                </div>
            </div>
        </dialog>
    );
}

export default RunnerDetailsPassageTimeForm;
