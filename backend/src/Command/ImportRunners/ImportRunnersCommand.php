<?php

namespace App\Command\ImportRunners;

use App\Database\DAO;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:import-runners',
    description: 'Import runners in database from a CSV file.',
)]
class ImportRunnersCommand extends Command
{
    protected const ARGUMENT_CSV_PATH = 'csvPath';

    protected const OPTION_CSV_SEPARATOR = 'separator';

    protected function configure()
    {
        $this->addArgument(static::ARGUMENT_CSV_PATH, InputArgument::REQUIRED, 'Input CSV file path');
        $this->addOption(static::OPTION_CSV_SEPARATOR, null, InputArgument::OPTIONAL, 'Values separator character', ';');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $csvPath = $input->getArgument(static::ARGUMENT_CSV_PATH);

        $csvSeparator = $input->getOption(self::OPTION_CSV_SEPARATOR);

        if (!is_file($csvPath)) {
            $output->writeln("File $csvPath not found");
            return Command::FAILURE;
        }

        $this->handleFileData($csvPath, $csvSeparator);

        $output->writeln("Importing data from $csvPath");
        return Command::SUCCESS;
    }

    private function handleFileData(string $csvPath, string $separator)
    {
        $handle = fopen($csvPath, 'r');

        if ($handle === false) {
            throw new \RuntimeException('Cannot read file');
        }

        DAO::getInstance()->beginTransaction();

        try {
            while (($line = fgetcsv($handle, separator: $separator)) !== false) {
                $this->handleFileLine($line);
            }

            DAO::getInstance()->commitTransaction();
        } catch (\Exception $e) {
            DAO::getInstance()->rollBackTransaction();
            throw $e;
        }
    }

    private function handleFileLine(array $lineData)
    {
        
    }
}
