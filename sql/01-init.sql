-- Create Prisma shadow database
CREATE DATABASE IF NOT EXISTS `prisma_shadow`;
GRANT ALL PRIVILEGES ON `prisma_shadow`.* TO 'admin'@'%';
