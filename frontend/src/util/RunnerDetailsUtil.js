import Util from "./Util";

class RunnerDetailsUtil {
    static processRunnerPassages = (runner) => {
        Util.verbose('Processing passages');

        for (let i = 0; i < runner.passages.length; ++i) {
            const passage = runner.passages[i];
            passage.processed = {};

            // TODO
        }

        Util.verbose('Passages processed');
    }
}

export default RunnerDetailsUtil;
