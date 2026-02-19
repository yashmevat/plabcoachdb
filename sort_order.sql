-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 16, 2026 at 06:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bookdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookmarks`
--

CREATE TABLE `bookmarks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `page_index` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookmarks`
--

INSERT INTO `bookmarks` (`id`, `user_id`, `book_id`, `page_index`, `created_at`, `updated_at`) VALUES
(9, 10, 6, 5, '2026-01-29 07:30:00', '2026-01-29 07:30:00'),
(10, 7, 6, 11, '2026-01-30 11:51:03', '2026-01-30 11:51:03'),
(12, 10, 6, 7, '2026-01-31 11:03:16', '2026-01-31 11:03:16'),
(13, 10, 6, 6, '2026-02-02 12:25:29', '2026-02-02 12:25:29'),
(14, 10, 6, 11, '2026-02-02 12:25:52', '2026-02-02 12:25:52'),
(15, 10, 6, 14, '2026-02-02 12:25:57', '2026-02-02 12:25:57'),
(16, 10, 44, 7, '2026-02-05 11:34:27', '2026-02-05 11:34:27'),
(17, 10, 149, 9, '2026-02-11 05:02:16', '2026-02-11 05:02:16'),
(18, 10, 149, 14, '2026-02-11 05:02:25', '2026-02-11 05:02:25'),
(19, 10, 180, 11, '2026-02-12 16:11:51', '2026-02-12 16:11:51');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `author_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `clone_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author_id`, `created_at`, `clone_id`) VALUES
(191, 'new book', 7, '2026-02-14 11:46:46', 1771069606512),
(192, 'new book 2 title updated', 7, '2026-02-14 11:47:52', 1771069672375);

-- --------------------------------------------------------

--
-- Table structure for table `highlights`
--

CREATE TABLE `highlights` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `page_index` int(11) NOT NULL,
  `selected_text` text NOT NULL,
  `color` varchar(50) NOT NULL DEFAULT '#FFFF00',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `topic_id` int(11) DEFAULT NULL,
  `subtopic_id` int(11) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `topic_id`, `subtopic_id`, `content`, `created_at`) VALUES
(2620, 400, 456, '<p>pages new book subtopic 1 all pages everywhere change</p>', '2026-02-14 11:47:01'),
(2621, 400, 457, '<p>pages new book subtopic 2</p>', '2026-02-14 11:47:19'),
(2622, 401, NULL, '<p>topic 2 pages</p>', '2026-02-14 11:47:35'),
(2623, 402, NULL, '<p>pages</p>', '2026-02-14 11:48:01'),
(2624, 403, NULL, '<p>topic 2 pages</p>', '2026-02-14 11:48:08'),
(2625, 404, 458, '<p>pages new book subtopic 1 all pages everywhere change</p>', '2026-02-14 11:49:02'),
(2626, 404, 459, '<p>pages new book subtopic 2</p>', '2026-02-14 11:49:02');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'superadmin', 'Full system access with all privileges', '2026-01-24 10:00:15', '2026-01-24 10:00:15'),
(2, 'author', 'Can create, edit and manage content', '2026-01-24 10:00:15', '2026-01-24 10:00:15'),
(3, 'user', 'Basic user access with limited privileges', '2026-01-24 10:00:15', '2026-01-24 10:00:15');

-- --------------------------------------------------------

--
-- Table structure for table `subtopics`
--

CREATE TABLE `subtopics` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `topic_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `clone_id` bigint(20) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subtopics`
--

INSERT INTO `subtopics` (`id`, `name`, `description`, `topic_id`, `book_id`, `author_id`, `created_at`, `updated_at`, `clone_id`, `sort_order`) VALUES
(456, 'subtopic 1 everywhere logic', NULL, 400, 191, 7, '2026-02-14 11:46:54', '2026-02-16 04:59:15', 1771069614287, 1),
(457, 'subtopic 2 changed', NULL, 400, 191, 7, '2026-02-14 11:47:10', '2026-02-16 04:59:15', 1771069630133, 2),
(458, 'subtopic 1 everywhere logic', NULL, 404, 192, 7, '2026-02-14 11:49:02', '2026-02-16 04:59:15', 1771069614287, 1),
(459, 'subtopic 2 changed', NULL, 404, 192, 7, '2026-02-14 11:49:02', '2026-02-16 04:59:15', 1771069630133, 2);

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

CREATE TABLE `topics` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `clone_id` bigint(20) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`id`, `name`, `description`, `book_id`, `created_at`, `clone_id`, `sort_order`) VALUES
(400, 'topic 1 changed', NULL, 191, '2026-02-14 11:46:49', 1771069609996, 1),
(401, 'topic 2 changes', NULL, 191, '2026-02-14 11:47:30', 1771069650800, 2),
(402, 'topic 1 new book', NULL, 192, '2026-02-14 11:47:58', 1771069678106, 1),
(403, 'topic 2 changes', NULL, 192, '2026-02-14 11:48:08', 1771069650800, 2),
(404, 'topic 1 changed', NULL, 192, '2026-02-14 11:49:02', 1771069609996, 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role_id`, `created_at`) VALUES
(3, 'superadmin', 'admin@example.com', '$2b$10$QhPl6ZzEBEJeDibVgLI4gOJvIy8VNSKSJSM4Bx26DfBQAQ7OPRRV6', 1, '2026-01-20 06:43:12'),
(7, 'yash', 'yashmevat16@gmail.com', '$2b$10$KULieyNgo06WMdbpKi15HO/WfdD7AvyQ4UrPNvLh54vnlSeRFdqa2', 2, '2026-01-24 06:29:48'),
(10, 'reader', 'reader@gmail.com', '$2b$10$EVtEULh8FqRPy4m8/zk37uL8M.TTczHtkcfVc2niuwRtruoAadYoG', 3, '2026-01-27 05:12:55'),
(11, 'yash mevat', 'yashmevat@gmail.com', '$2b$10$juPtu.6mDt5ZYDKz0qBcMOI5Iy.oSd2eZ2pGEq8sLnlUHW/rvbJiS', 2, '2026-02-05 11:03:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_book_page` (`user_id`,`book_id`,`page_index`),
  ADD KEY `idx_user_book` (`user_id`,`book_id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `highlights`
--
ALTER TABLE `highlights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_book_user` (`book_id`,`user_id`),
  ADD KEY `idx_page_index` (`page_index`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_subtopic` (`subtopic_id`),
  ADD KEY `idx_topic` (`topic_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `subtopics`
--
ALTER TABLE `subtopics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_topic` (`topic_id`),
  ADD KEY `idx_book` (`book_id`),
  ADD KEY `idx_author` (`author_id`),
  ADD KEY `idx_topic_book` (`topic_id`,`book_id`),
  ADD KEY `idx_subtopics_topic_sort` (`topic_id`,`sort_order`);

--
-- Indexes for table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_book` (`book_id`),
  ADD KEY `idx_topics_book_sort` (`book_id`,`sort_order`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=194;

--
-- AUTO_INCREMENT for table `highlights`
--
ALTER TABLE `highlights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2629;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subtopics`
--
ALTER TABLE `subtopics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=462;

--
-- AUTO_INCREMENT for table `topics`
--
ALTER TABLE `topics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=406;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `highlights`
--
ALTER TABLE `highlights`
  ADD CONSTRAINT `highlights_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `highlights_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pages`
--
ALTER TABLE `pages`
  ADD CONSTRAINT `pages_ibfk_2` FOREIGN KEY (`subtopic_id`) REFERENCES `subtopics` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pages_ibfk_topic` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subtopics`
--
ALTER TABLE `subtopics`
  ADD CONSTRAINT `subtopics_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subtopics_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subtopics_ibfk_3` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `topics`
--
ALTER TABLE `topics`
  ADD CONSTRAINT `topics_ibfk_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
