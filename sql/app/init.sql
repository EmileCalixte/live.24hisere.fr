-- Populate live database
SOURCE /docker-entrypoint-initdb.d/data/live.sql;

-- Create test database
CREATE DATABASE IF NOT EXISTS `live_test`;
GRANT ALL PRIVILEGES ON `live_test`.* TO 'admin'@'%';

-- Populate test database
USE `live_test`;
SOURCE /docker-entrypoint-initdb.d/data/live.sql;
SOURCE /docker-entrypoint-initdb.d/data/test-database-data.sql;
