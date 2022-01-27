import OptionWithLoadingDots from "../../misc/OptionWithLoadingDots";

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

                    {/*TODO display this only if runners are not fetched yet*/}
                    <OptionWithLoadingDots>
                        Chargement des coureurs
                    </OptionWithLoadingDots>
                </select>
            </div>
        </div>
    )
}

export default RunnerSelector;
