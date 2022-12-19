<?php

namespace App\Command\Cron;

use App\Database\Entity\Config;
use App\Database\Repository\ConfigRepository;
use App\Database\Repository\RepositoryProvider;
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

        var_dump($dagFileContent);

        return Command::SUCCESS;
    }
}
