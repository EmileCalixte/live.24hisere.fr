<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class HelloWorldCommand extends Command
{
    protected static $defaultName = 'app:hello-world';

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        echo "Hello world";
        return Command::SUCCESS;
    }
}
