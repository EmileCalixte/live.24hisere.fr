-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : umami-db
-- Généré le : dim. 15 juin 2025 à 19:54
-- Version du serveur : 10.11.6-MariaDB-1:10.11.6+maria~ubu2204
-- Version de PHP : 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `umami`
--

DELIMITER $$
--
-- Fonctions
--
$$

$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `event_data`
--

CREATE TABLE `event_data` (
  `event_data_id` varchar(36) NOT NULL,
  `website_event_id` varchar(36) NOT NULL,
  `website_id` varchar(36) NOT NULL,
  `data_key` varchar(500) NOT NULL,
  `string_value` varchar(500) DEFAULT NULL,
  `number_value` decimal(19,4) DEFAULT NULL,
  `date_value` timestamp NULL DEFAULT NULL,
  `data_type` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `report`
--

CREATE TABLE `report` (
  `report_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `website_id` varchar(36) NOT NULL,
  `type` varchar(200) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` varchar(500) NOT NULL,
  `parameters` varchar(6000) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `session`
--

CREATE TABLE `session` (
  `session_id` varchar(36) NOT NULL,
  `website_id` varchar(36) NOT NULL,
  `browser` varchar(20) DEFAULT NULL,
  `os` varchar(20) DEFAULT NULL,
  `device` varchar(20) DEFAULT NULL,
  `screen` varchar(11) DEFAULT NULL,
  `language` varchar(35) DEFAULT NULL,
  `country` char(2) DEFAULT NULL,
  `region` char(20) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `distinct_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `session_data`
--

CREATE TABLE `session_data` (
  `session_data_id` varchar(36) NOT NULL,
  `website_id` varchar(36) NOT NULL,
  `session_id` varchar(36) NOT NULL,
  `data_key` varchar(500) NOT NULL,
  `string_value` varchar(500) DEFAULT NULL,
  `number_value` decimal(19,4) DEFAULT NULL,
  `date_value` timestamp NULL DEFAULT NULL,
  `data_type` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `distinct_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `team`
--

CREATE TABLE `team` (
  `team_id` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `access_code` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `logo_url` varchar(2183) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `team_user`
--

CREATE TABLE `team_user` (
  `team_user_id` varchar(36) NOT NULL,
  `team_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `user_id` varchar(36) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(60) NOT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `logo_url` varchar(2183) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `role`, `created_at`, `updated_at`, `deleted_at`, `display_name`, `logo_url`) VALUES
('41e2b680-648e-4b09-bcd7-3e2b10c06264', 'admin', '$2b$10$BUli0c.muyCW1ErNJc3jL.vFRFtFJWrT8/GcR4A.sUdCznaXiqFXa', 'admin', '2025-06-15 19:50:02', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `website`
--

CREATE TABLE `website` (
  `website_id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `domain` varchar(500) DEFAULT NULL,
  `share_id` varchar(50) DEFAULT NULL,
  `reset_at` timestamp NULL DEFAULT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `team_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `website`
--

INSERT INTO `website` (`website_id`, `name`, `domain`, `share_id`, `reset_at`, `user_id`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `team_id`) VALUES
('0d9a218d-6d62-4e14-9215-272e5a41c210', 'live', 'localhost', NULL, NULL, '41e2b680-648e-4b09-bcd7-3e2b10c06264', '2025-06-15 19:52:14', '2025-06-15 19:52:14', NULL, '41e2b680-648e-4b09-bcd7-3e2b10c06264', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `website_event`
--

CREATE TABLE `website_event` (
  `event_id` varchar(36) NOT NULL,
  `website_id` varchar(36) NOT NULL,
  `session_id` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `url_path` varchar(500) NOT NULL,
  `url_query` varchar(500) DEFAULT NULL,
  `referrer_path` varchar(500) DEFAULT NULL,
  `referrer_query` varchar(500) DEFAULT NULL,
  `referrer_domain` varchar(500) DEFAULT NULL,
  `page_title` varchar(500) DEFAULT NULL,
  `event_type` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `event_name` varchar(50) DEFAULT NULL,
  `visit_id` varchar(36) NOT NULL,
  `tag` varchar(50) DEFAULT NULL,
  `fbclid` varchar(255) DEFAULT NULL,
  `gclid` varchar(255) DEFAULT NULL,
  `li_fat_id` varchar(255) DEFAULT NULL,
  `msclkid` varchar(255) DEFAULT NULL,
  `ttclid` varchar(255) DEFAULT NULL,
  `twclid` varchar(255) DEFAULT NULL,
  `utm_campaign` varchar(255) DEFAULT NULL,
  `utm_content` varchar(255) DEFAULT NULL,
  `utm_medium` varchar(255) DEFAULT NULL,
  `utm_source` varchar(255) DEFAULT NULL,
  `utm_term` varchar(255) DEFAULT NULL,
  `hostname` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('1f868990-f3c4-4081-a5b5-656c20850eaf', '6981c78cd41f7d0d49535389d7a1054907e5a4d157421de57f2bbe4f15136166', '2025-06-15 19:50:02.341', '01_init', NULL, NULL, '2025-06-15 19:50:01.816', 1),
('441b868c-ffd6-43fa-a725-d29ed18acccf', '32214b9641c46c80f09e35657592518e370a12dcaac776045db23b748c27b039', '2025-06-15 19:50:02.610', '02_report_schema_session_data', NULL, NULL, '2025-06-15 19:50:02.343', 1),
('6cae3aca-aa0f-4ccd-bd08-8aa90014965c', 'd94e390749a499e7dd01b6ba115aa6a7c7c116268bfa8d10d07a52311bf5aad9', '2025-06-15 19:50:04.180', '04_team_redesign', NULL, NULL, '2025-06-15 19:50:03.763', 1),
('82915c33-c94d-47fc-87bc-29b70f5c0f00', '61a33c5c8bd69f3808c83adfadbdf65126034e1b8a70678744c8d833bbcf03a0', '2025-06-15 19:50:05.624', '10_add_distinct_id', NULL, NULL, '2025-06-15 19:50:05.536', 1),
('83f6568b-f031-449c-a72f-c6e8ef6b041d', 'c608c8fabd56ea757a8191aad2f9997311342055ee5b11b72057cd28b3eee8dd', '2025-06-15 19:50:04.938', '06_session_data', NULL, NULL, '2025-06-15 19:50:04.584', 1),
('8ca514a3-ebf2-41ba-91e5-2cad887d0f4a', '371184e7c4ab48b35e8515005aeddcdde0c073460ece3b2bd54dca0b50f140a3', '2025-06-15 19:50:03.757', '03_metric_performance_index', NULL, NULL, '2025-06-15 19:50:02.613', 1),
('a5e46f7b-2c89-49ee-93fb-8459a4c42348', '6ac54ce09837e65f2c81717e33bddc2cdcb2474f9b17d794660b8f31d4b6969d', '2025-06-15 19:50:04.581', '05_add_visit_id', NULL, NULL, '2025-06-15 19:50:04.189', 1),
('d660ec08-4020-4f97-8f4e-e64549f01a6b', 'aff722aa0432d85d3555363acd524a1c257cec8dc0f50ce32a9d55b4d720de21', '2025-06-15 19:50:05.533', '09_update_hostname_region', NULL, NULL, '2025-06-15 19:50:05.223', 1),
('e7cd1abc-b07d-4152-8e6e-c452e16c42b3', '432303498733b4ef4e25213430fd04b51373c26b318d866490c054be787dda66', '2025-06-15 19:50:05.042', '07_add_tag', NULL, NULL, '2025-06-15 19:50:04.944', 1),
('faf24ea2-20de-4a84-9fdd-fabb5fcc25c9', '1e1c6a77668d16353c47b92a7f6b2f9ab83cc0bfc03dee8e4014cb567bf3b464', '2025-06-15 19:50:05.218', '08_add_utm_clid', NULL, NULL, '2025-06-15 19:50:05.044', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `event_data`
--
ALTER TABLE `event_data`
  ADD PRIMARY KEY (`event_data_id`),
  ADD KEY `event_data_created_at_idx` (`created_at`),
  ADD KEY `event_data_website_id_idx` (`website_id`),
  ADD KEY `event_data_website_event_id_idx` (`website_event_id`),
  ADD KEY `event_data_website_id_created_at_idx` (`website_id`,`created_at`),
  ADD KEY `event_data_website_id_created_at_data_key_idx` (`website_id`,`created_at`,`data_key`);

--
-- Index pour la table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`report_id`),
  ADD UNIQUE KEY `report_report_id_key` (`report_id`),
  ADD KEY `report_user_id_idx` (`user_id`),
  ADD KEY `report_website_id_idx` (`website_id`),
  ADD KEY `report_type_idx` (`type`),
  ADD KEY `report_name_idx` (`name`);

--
-- Index pour la table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`session_id`),
  ADD UNIQUE KEY `session_session_id_key` (`session_id`),
  ADD KEY `session_created_at_idx` (`created_at`),
  ADD KEY `session_website_id_idx` (`website_id`),
  ADD KEY `session_website_id_created_at_idx` (`website_id`,`created_at`),
  ADD KEY `session_website_id_created_at_browser_idx` (`website_id`,`created_at`,`browser`),
  ADD KEY `session_website_id_created_at_os_idx` (`website_id`,`created_at`,`os`),
  ADD KEY `session_website_id_created_at_device_idx` (`website_id`,`created_at`,`device`),
  ADD KEY `session_website_id_created_at_screen_idx` (`website_id`,`created_at`,`screen`),
  ADD KEY `session_website_id_created_at_language_idx` (`website_id`,`created_at`,`language`),
  ADD KEY `session_website_id_created_at_country_idx` (`website_id`,`created_at`,`country`),
  ADD KEY `session_website_id_created_at_city_idx` (`website_id`,`created_at`,`city`),
  ADD KEY `session_website_id_created_at_region_idx` (`website_id`,`created_at`,`region`);

--
-- Index pour la table `session_data`
--
ALTER TABLE `session_data`
  ADD PRIMARY KEY (`session_data_id`),
  ADD KEY `session_data_created_at_idx` (`created_at`),
  ADD KEY `session_data_website_id_idx` (`website_id`),
  ADD KEY `session_data_session_id_idx` (`session_id`),
  ADD KEY `session_data_session_id_created_at_idx` (`session_id`,`created_at`),
  ADD KEY `session_data_website_id_created_at_data_key_idx` (`website_id`,`created_at`,`data_key`);

--
-- Index pour la table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`team_id`),
  ADD UNIQUE KEY `team_team_id_key` (`team_id`),
  ADD UNIQUE KEY `team_access_code_key` (`access_code`),
  ADD KEY `team_access_code_idx` (`access_code`);

--
-- Index pour la table `team_user`
--
ALTER TABLE `team_user`
  ADD PRIMARY KEY (`team_user_id`),
  ADD UNIQUE KEY `team_user_team_user_id_key` (`team_user_id`),
  ADD KEY `team_user_team_id_idx` (`team_id`),
  ADD KEY `team_user_user_id_idx` (`user_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_user_id_key` (`user_id`),
  ADD UNIQUE KEY `user_username_key` (`username`);

--
-- Index pour la table `website`
--
ALTER TABLE `website`
  ADD PRIMARY KEY (`website_id`),
  ADD UNIQUE KEY `website_website_id_key` (`website_id`),
  ADD UNIQUE KEY `website_share_id_key` (`share_id`),
  ADD KEY `website_user_id_idx` (`user_id`),
  ADD KEY `website_created_at_idx` (`created_at`),
  ADD KEY `website_share_id_idx` (`share_id`),
  ADD KEY `website_team_id_idx` (`team_id`),
  ADD KEY `website_created_by_idx` (`created_by`);

--
-- Index pour la table `website_event`
--
ALTER TABLE `website_event`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `website_event_created_at_idx` (`created_at`),
  ADD KEY `website_event_session_id_idx` (`session_id`),
  ADD KEY `website_event_website_id_idx` (`website_id`),
  ADD KEY `website_event_website_id_created_at_idx` (`website_id`,`created_at`),
  ADD KEY `website_event_website_id_session_id_created_at_idx` (`website_id`,`session_id`,`created_at`),
  ADD KEY `website_event_website_id_created_at_url_path_idx` (`website_id`,`created_at`,`url_path`),
  ADD KEY `website_event_website_id_created_at_url_query_idx` (`website_id`,`created_at`,`url_query`),
  ADD KEY `website_event_website_id_created_at_referrer_domain_idx` (`website_id`,`created_at`,`referrer_domain`),
  ADD KEY `website_event_website_id_created_at_page_title_idx` (`website_id`,`created_at`,`page_title`),
  ADD KEY `website_event_website_id_created_at_event_name_idx` (`website_id`,`created_at`,`event_name`),
  ADD KEY `website_event_visit_id_idx` (`visit_id`),
  ADD KEY `website_event_website_id_visit_id_created_at_idx` (`website_id`,`visit_id`,`created_at`),
  ADD KEY `website_event_website_id_created_at_tag_idx` (`website_id`,`created_at`,`tag`),
  ADD KEY `website_event_website_id_created_at_hostname_idx` (`website_id`,`created_at`,`hostname`);

--
-- Index pour la table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
