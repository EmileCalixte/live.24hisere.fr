-- Create test database
CREATE DATABASE IF NOT EXISTS `live_test`;
GRANT ALL PRIVILEGES ON `live_test`.* TO 'admin'@'%';

-- Populate test database
USE `live_test`;
SOURCE /docker-entrypoint-initdb.d/live.sql;
SOURCE /docker-entrypoint-initdb.d/test-database-data.sql;
