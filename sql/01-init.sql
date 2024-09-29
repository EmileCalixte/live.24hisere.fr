-- Create Prisma shadow database
CREATE DATABASE IF NOT EXISTS `prisma_shadow`;
GRANT ALL PRIVILEGES ON `prisma_shadow`.* TO 'admin'@'%';

-- Temporary: Create specific database for Drizzle
CREATE DATABASE IF NOT EXISTS `live_drizzle`;
GRANT ALL PRIVILEGES ON `live_drizzle`.* TO 'admin'@'%';
