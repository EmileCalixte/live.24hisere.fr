<?php

namespace App\Command\ImportRunners;

use App\Database\DAO;
use App\Database\RunnerDataLineSaver;
use App\Exception\Csv\InvalidColumnCountException;
use App\Exception\Csv\MalformedCsvFileException;
use App\Model\RunnersCsvDataLine\DataLine;
use App\Model\RunnersCsvDataLine\Exception\InvalidDataFormatException;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
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
        $this->addOption(static::OPTION_CSV_SEPARATOR, null, InputOption::VALUE_REQUIRED, 'Values separator character', ';');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $csvPath = $input->getArgument(static::ARGUMENT_CSV_PATH);

        $csvSeparator = $input->getOption(self::OPTION_CSV_SEPARATOR);

        if (!is_file($csvPath)) {
            $output->writeln("File $csvPath not found");
            return Command::FAILURE;
        }

        try {
            $this->handleFileData($csvPath, $csvSeparator, $output);
        } catch (MalformedCsvFileException $e) {
            $output->write("Error: Malformed CSV at line {$e->getCsvFileLine()}");
            if ($e->getMessage()) {
                $output->write(" - {$e->getMessage()}");
            }
            $output->writeln("");
            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }

    /**
     * @param string $csvPath
     * @param string $separator
     * @param OutputInterface $output
     * @throws InvalidColumnCountException if $line contains an invalid number of data
     * @throws MalformedCsvFileException if a data is malformed or invalid
     */
    private function handleFileData(string $csvPath, string $separator, OutputInterface $output)
    {
        $handle = fopen($csvPath, 'r');

        if ($handle === false) {
            throw new \RuntimeException('Cannot read file');
        }

        DAO::getInstance()->beginTransaction();

        try {
            $i = 0;

            $dataLineSaver = new RunnerDataLineSaver();

            while (($line = fgetcsv($handle, separator: $separator)) !== false) {
                ++$i;

                if ($i === 1) {
                    $output->writeln("Ignoring header line");
                    continue;
                }

                $dataLine = $this->getDataLineFromCsvLine($line, $i);

                $existingRunner = DAO::getInstance()->getRunner($dataLine->getRunnerId());

                if ($existingRunner !== false) {
                    $output->writeln("A runner with ID {$dataLine->getRunnerId()} already exists (${existingRunner['firstname']} {$existingRunner['lastname']}), ignoring");
                    continue;
                }

                $output->writeln("Importing {$dataLine->getRunnerId()} - {$dataLine->getRunnerFirstname()} {$dataLine->getRunnerLastname()}");

                $dataLineSaver->saveDataLine($dataLine);

                $output->writeln("Done");
            }

            DAO::getInstance()->commitTransaction();
        } catch (InvalidColumnCountException $e) {
            DAO::getInstance()->rollBackTransaction();
            throw new MalformedCsvFileException($e->getCsvFileLine(), previous: $e);
        } catch (\Exception $e) {
            DAO::getInstance()->rollBackTransaction();
            throw $e;
        }
    }

    /**
     * @param array $line
     * @param int $lineNumber
     * @return DataLine
     * @throws InvalidColumnCountException if $line contains an invalid number of data
     * @throws MalformedCsvFileException if a data is malformed or invalid
     */
    private function getDataLineFromCsvLine(array $line, int $lineNumber): DataLine
    {
        if (count($line) !== 5) {
            throw new InvalidColumnCountException($lineNumber);
        }

        try {
            $dataLine = new DataLine($line);
        } catch (InvalidDataFormatException $e) {
            throw new MalformedCsvFileException($lineNumber, $e->getMessage(), previous: $e);
        }

        return $dataLine;
    }
}
