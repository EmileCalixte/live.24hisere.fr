import Util from "./Util";

class RunnerDetailsUtil {
    static getProcessedPassages = (passages) => {
        Util.verbose('Processing passages');

        const processedPassages = [];

        for (let i = 0; i < passages.length; ++i) {
            const passage = passages[i];

            processedPassages.push(passage);

            // TODO
        }

        Util.verbose('Passages processed');

        return processedPassages;
    }
}

export default RunnerDetailsUtil;
