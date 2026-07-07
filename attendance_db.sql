-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 07, 2026 at 04:51 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `attendance_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `attendance_date` date NOT NULL,
  `clock_in` datetime(3) DEFAULT NULL,
  `clock_out` datetime(3) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `created_at`, `updated_at`, `deleted_at`, `user_id`, `attendance_date`, `clock_in`, `clock_out`, `status`) VALUES
(1, '2026-07-07 10:17:23.429', '2026-07-07 10:47:31.395', NULL, 1, '2026-07-07', '2026-07-07 10:17:23.429', '2026-07-07 10:47:31.395', 'late');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `full_name` varchar(50) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'employee',
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `deleted_at`, `full_name`, `email`, `password`, `role`, `is_active`) VALUES
(1, '2026-07-03 19:38:45.537', '2026-07-03 19:38:45.537', NULL, 'Rafi Bakhtiar Cahyadi', 'rafibakkhtiar@gmail.com', '$2a$10$Ir9K./gdwa2tBXAwcywVFOWeItyjlof3yMOKWIPhDN7TWFewQ5nHG', 'employee', 1),
(4, '2026-07-03 20:11:46.474', '2026-07-03 20:11:46.474', NULL, 'Rafi Bakhtiar', 'rafibakkhtiar23@gmail.com', '$2a$10$C9rbuIH4mSvSirLCa50uEO9op684vwC5SA2iHJNjsTUqlRsQ4/YYi', 'employee', 1),
(6, '2026-07-05 12:00:22.325', '2026-07-05 12:00:22.325', NULL, 'Asep Saepudin', 'rafibakkhtiar212@gmail.com', '$2a$10$YB12svikx6WJDu7IIFbzPuptUqJ2IacSqqmfRuC3DSw/CYUW5P60a', 'employee', 1),
(7, '2026-07-05 12:00:40.698', '2026-07-05 12:00:40.698', NULL, 'Fibee', 'fibe2320@gmail.com', '$2a$10$2f8vPLJSHnN9hZ8ilLUXOeMfOulgvDysaDn3XY3v7D93LMu6OUJRu', 'admin', 1),
(8, '2026-07-07 11:02:31.570', '2026-07-07 11:38:24.083', NULL, 'Test Employee', 'testemployee@attenda.com', '$2a$10$3nzug7iJOs/dZy7sF22ip.4yGAZTDJ6jl9Nawcl4PDYcxRRZMcZLy', 'employee', 1),
(9, '2026-07-07 11:09:21.894', '2026-07-07 11:09:21.894', NULL, 'Dimas Aji Wicaksono', 'dimasaji@gmail.com', '$2a$10$3G690a2yA5CnCmurHYfOn.HhR0WGG1nViX8Nuwh9C8RyYsJ/xSQOe', 'employee', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_user_date` (`user_id`,`attendance_date`),
  ADD KEY `idx_attendances_deleted_at` (`deleted_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_users_email` (`email`),
  ADD KEY `idx_users_deleted_at` (`deleted_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `fk_attendances_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
