-- Add test data to test database
INSERT INTO `user` (`id`, `username`, `password_hash`) VALUES
(2, 'Test', '$argon2id$v=19$m=65536,t=4,p=1$dNCcA763Qsi4EKw0YSvLpA$lNNnaAlVDs7jFwMfSoMnLSziOhTFs4kL2VRcLq8Iwt8'); -- Password: `test`

INSERT INTO `access_token` (`token`, `user_id`, `expiration_date`) VALUES
('EXPIRED_TEST_ACCESS_TOKEN', 1, '2000-01-01 00:00:00'),
('TEST_ACCESS_TOKEN', 1, '9999-12-31 23:59:59');
