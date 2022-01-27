const RunnerSelector = () => {
    return(
        <div className="runner-details-runner-selector-container">
            <div className="input-group">
                <label htmlFor="runner-select">
                    Coureur
                </label>
                <select id="runner-select"
                        className="input-select"
                >
                    <option selected disabled hidden>Sélectionnez un coureur</option>
                </select>
            </div>
        </div>
    )
}

export default RunnerSelector;
