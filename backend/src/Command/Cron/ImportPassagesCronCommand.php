<?php

namespace App\Command\Cron;

use App\Database\Entity\Config;
use App\Database\Entity\Passage;
use App\Database\Entity\Runner;
use App\Database\Repository\ConfigRepository;
use App\Database\Repository\PassageRepository;
use App\Database\Repository\RepositoryProvider;
use App\Database\Repository\RunnerRepository;
use App\MainApp;
use App\Model\PassagesFileDataLine\DataLine;
use Curl\Curl;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'cron:import-passages',
    description: 'Import passages from a dag-systems text file.',
)]
class ImportPassagesCronCommand extends Command
{
    private PassageRepository $passageRepository;

    private RunnerRepository $runnerRepository;

    public function __construct(string $name = null)
    {
        /** @var PassageRepository $passageRepository */
        $passageRepository = RepositoryProvider::getRepository(Passage::class);

        /** @var RunnerRepository $runnerRepository */
        $runnerRepository = RepositoryProvider::getRepository(Runner::class);

        $this->passageRepository = $passageRepository;
        $this->runnerRepository = $runnerRepository;

        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        /** @var ConfigRepository $configRepository */
        $configRepository = RepositoryProvider::getRepository(Config::class);

        $dagFilePath = $configRepository->getKeyValue(Config::KEY_IMPORT_DAG_FILE_PATH);

        if (is_null($dagFilePath)) {
            $output->writeln('Dag file path is not defined');
            return Command::FAILURE;
        }

        $curl = (new Curl())->get($dagFilePath);

        if (!$curl->isSuccess()) {
            $output->writeln("Curl error: $curl->curl_error_message ($curl->error_code)");
            return Command::FAILURE;
        }

        $dagFileContent = $curl->response;

        $curl->close();

        $lines = array_filter(preg_split("/(\r\n|\n|\r)/", $dagFileContent), function ($line) {
            return !empty($line);
        });

        $connection = MainApp::getInstance()->getEntityManager()->getConnection();

        $connection->beginTransaction();

        try {
            foreach ($lines as $line) {
                $this->handleLine($line, $output);
            }
        } catch (\Exception $e) {
            $connection->rollBack();
            throw $e;
        }

        $connection->commit();

        return Command::SUCCESS;
    }

    private function handleLine(string $line, OutputInterface $output) {
        $dataLine = new DataLine($line);

        $existingPassage = $this->passageRepository->findByDetectionId($dataLine->getPassageId());

        if (!is_null($existingPassage)) {
            // Passage already saved in database, ignoring
            return;
        }

        $runner = $this->runnerRepository->findById($dataLine->getRunnerId());

        if (is_null($runner)) {
            // Runner is not registered in database, ignoring
            return;
        }

        $output->writeln("Saving passage {$dataLine->getPassageId()}");

        $passage = new Passage();

        $passage->setDetectionId($dataLine->getPassageId());
        $passage->setRunner($runner);
        $passage->setTime(\DateTime::createFromImmutable($dataLine->getPassageDateTime()));
        $passage->setIsHidden(false);

        MainApp::getInstance()->getEntityManager()->persist($passage);
        MainApp::getInstance()->getEntityManager()->flush();
    }
}
