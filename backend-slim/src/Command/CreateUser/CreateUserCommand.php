<?php

namespace App\Command\CreateUser;

use App\Database\Entity\User;
use App\Database\Repository\UserRepository;
use App\MainApp;
use App\Misc\Util\PasswordUtil;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\QuestionHelper;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;

#[AsCommand(
    name: 'app:create-user',
    description: 'Create a user.',
)]
class CreateUserCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $user = new User();

        $this->defineUsernameFromInput($user, $input, $output);
        $this->definePasswordFromInput($user, $input, $output);

        $entityManager = MainApp::getInstance()->getEntityManager();

        $entityManager->persist($user);
        $entityManager->flush();

        $output->writeln('User created');

        return Command::SUCCESS;
    }

    protected function defineUsernameFromInput(User $user, InputInterface $input, OutputInterface $output)
    {
        /** @var QuestionHelper $questionHelper */
        $questionHelper = $this->getHelper('question');
        $question = new Question('Enter username: ');

        while (true) {
            $inputUsername = trim($questionHelper->ask($input, $output, $question));

            try {
                $user->setUsername($inputUsername);

                /** @var UserRepository $userRepository */
                $userRepository = MainApp::getInstance()->getEntityManager()->getRepository(User::class);
                $existingUser = $userRepository->findByUsername($user->getUsername());

                if (!is_null($existingUser)) {
                    $output->writeln("User {$user->getUsername()} already exists");
                    continue;
                }

                return;
            } catch (\InvalidArgumentException $e) {
                $output->writeln($e->getMessage());
            }
        }
    }

    protected function definePasswordFromInput(User $user, InputInterface $input, OutputInterface $output)
    {
        /** @var QuestionHelper $questionHelper */
        $questionHelper = $this->getHelper('question');
        $passwordQuestion = new Question("Enter password for {$user->getUsername()}: ");
        $confirmPasswordQuestion = new Question('Confirm password: ');

        $passwordQuestion->setHidden(true);
        $passwordQuestion->setHiddenFallback(false);

        $confirmPasswordQuestion->setHidden(true);
        $confirmPasswordQuestion->setHiddenFallback(false);

        while (true) {
            $inputPassword = trim($questionHelper->ask($input, $output, $passwordQuestion));

            if (empty($inputPassword)) {
                $output->writeln('Password cannot be empty');
                continue;
            }

            $inputConfirmPassword = trim($questionHelper->ask($input, $output, $confirmPasswordQuestion));

            if ($inputPassword !== $inputConfirmPassword) {
                $output->writeln('Passwords do not match');
                continue;
            }

            $passwordHash = PasswordUtil::getPasswordHash($inputPassword);

            $user->setPasswordHash($passwordHash);
            return;
        }
    }
}
