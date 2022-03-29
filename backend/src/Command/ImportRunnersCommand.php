<?php

namespace App\Command;

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

    protected function configure()
    {
        $this->addArgument(static::ARGUMENT_CSV_PATH, InputArgument::REQUIRED, 'Input CSV file path');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $csvPath = $input->getArgument(static::ARGUMENT_CSV_PATH);
        $output->writeln("Importing data from $csvPath");
        return Command::SUCCESS;
    }
}
