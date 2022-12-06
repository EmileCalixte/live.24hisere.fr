<?php

namespace App\Command\Cron;

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
        $output->writeln('TODO import passages');

        return Command::SUCCESS;
    }
}
