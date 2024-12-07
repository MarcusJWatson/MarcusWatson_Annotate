-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 07, 2024 at 11:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs_445_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `book_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `cover_image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`book_id`, `title`, `description`, `cover_image_url`, `created_at`, `created_by`, `rating`) VALUES
(1, 'The Hidden Palace', 'A mesmerizing tale of magic and mystery in a forgotten kingdom', '/book-covers/hidden-palace.jpg', '2024-12-05 21:21:29', 1, 4.50),
(2, 'Stellar Dreams', 'An epic space adventure across distant galaxies', '/book-covers/stellar-dreams.jpg', '2024-12-05 21:21:29', 1, 4.75),
(3, 'The Last Detective', 'A gripping murder mystery set in Victorian London', '/book-covers/last-detective.jpg', '2024-12-05 21:21:29', 2, 4.25),
(4, 'The Ocean\'s Whispers', 'A tale of underwater civilizations and their forgotten histories', '/book-covers/ocean-whispers.jpg', '2024-12-05 21:21:29', 3, 4.50),
(5, 'Digital Dreams', 'Exploring the intersection of technology and consciousness', '/book-covers/digital-dreams.jpg', '2024-12-05 21:21:29', 1, 4.75),
(6, 'ffffff', 'ss', '/book-covers/coverImage-1733463299826-555781508.png', '2024-12-06 05:34:59', 6, 0.20),
(7, 'anothersmaker', 'bling blow ', '/book-covers/coverImage-1733526417153-962782865.png', '2024-12-06 23:06:57', 6, 5.00),
(8, 'ddddddd', 'ssss', '/book-covers/coverImage-1733526558474-201862660.png', '2024-12-06 23:09:18', 6, 0.60),
(9, 'delet me plz', 'aaaaa', NULL, '2024-12-07 02:02:48', 6, 0.20);

-- --------------------------------------------------------

--
-- Table structure for table `booktags`
--

CREATE TABLE `booktags` (
  `book_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booktags`
--

INSERT INTO `booktags` (`book_id`, `tag_id`) VALUES
(1, 1),
(1, 3),
(1, 4),
(2, 2),
(2, 6),
(3, 3),
(3, 5),
(4, 1),
(4, 6),
(5, 2),
(5, 7);

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `chapter_id` int(11) NOT NULL,
  `book_id` int(11) DEFAULT NULL,
  `chapter_number` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chapters`
--

INSERT INTO `chapters` (`chapter_id`, `book_id`, `chapter_number`, `title`) VALUES
(1, 1, 1, 'The Forgotten Gate'),
(2, 1, 2, 'Whispers in the Corridors'),
(3, 1, 3, 'The Royal Secret'),
(4, 1, 4, 'Moonlit Revelations'),
(5, 1, 5, 'The Ancient Prophecy'),
(6, 2, 1, 'Launch Sequence'),
(7, 2, 2, 'The Void Between'),
(8, 2, 3, 'First Contact'),
(9, 2, 4, 'The Nebula\'s Heart'),
(10, 2, 5, 'Journey\'s End'),
(11, 3, 1, 'The Body in the Library'),
(12, 3, 2, 'Shadow of Doubt'),
(13, 3, 3, 'The Clockmaker\'s Alibi'),
(14, 3, 4, 'Hidden in Plain Sight'),
(15, 3, 5, 'The Final Deduction'),
(16, 4, 1, 'Beneath the Waves'),
(17, 4, 2, 'The Coral City'),
(18, 4, 3, 'Deep Secrets'),
(19, 4, 4, 'The Abyssal Truth'),
(20, 4, 5, 'Surface Revelations'),
(21, 5, 1, 'Binary Beginnings'),
(22, 5, 2, 'The Neural Network'),
(23, 5, 3, 'Digital Consciousness'),
(24, 5, 4, 'System Override'),
(25, 5, 5, 'Awakening');

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

CREATE TABLE `quotes` (
  `quote_id` int(11) NOT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `quote_text` text DEFAULT NULL,
  `context` text DEFAULT NULL,
  `explanation` text DEFAULT NULL,
  `context_image_location` varchar(255) DEFAULT NULL,
  `quote_number` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotes`
--

INSERT INTO `quotes` (`quote_id`, `chapter_id`, `quote_text`, `context`, `explanation`, `context_image_location`, `quote_number`, `created_at`) VALUES
(1, 1, 'The marble halls whispered secrets of a thousand years', 'Opening scene in the palace', 'Establishes the magical atmosphere and history of the setting', NULL, 1, '2024-12-05 21:21:29'),
(2, 2, 'Shadows danced on the walls like memories trying to break free', 'Night scene in the corridor', 'Symbolizes the past trying to reveal itself to the protagonist', NULL, 1, '2024-12-05 21:21:29'),
(3, 3, 'In the throne room, even silence had a voice', 'Discovery of ancient scroll', 'Represents the weight of history and untold stories', NULL, 1, '2024-12-05 21:21:29'),
(4, 6, 'Stars streaked past like rain on a windshield', 'First hyperspace jump', 'Connects cosmic travel to familiar experiences', NULL, 1, '2024-12-05 21:21:29'),
(5, 7, 'The void between worlds held more questions than answers', 'Deep space exploration', 'Reflects the mysteries of space exploration', NULL, 1, '2024-12-05 21:21:29'),
(6, 8, 'We were no longer alone in the universe, and that changed everything', 'Alien contact', 'Captures the moment of first contact', NULL, 1, '2024-12-05 21:21:29'),
(7, 11, 'The truth was a puzzle with missing pieces', 'Investigation scene', 'Metaphor for the mystery-solving process', NULL, 1, '2024-12-05 21:21:29'),
(8, 12, 'Sometimes the most obvious clue is the one we refuse to see', 'Detective\'s reflection', 'Commentary on human nature and investigation', NULL, 1, '2024-12-05 21:21:29'),
(9, 13, 'Time was both ally and enemy in this case', 'Race against time', 'Tension between solving the case and preservation of evidence', NULL, 1, '2024-12-05 21:21:29');

-- --------------------------------------------------------

--
-- Table structure for table `subquotes`
--

CREATE TABLE `subquotes` (
  `subquote_id` int(11) NOT NULL,
  `quote_id` int(11) DEFAULT NULL,
  `subquote_text` text DEFAULT NULL,
  `explanation` text DEFAULT NULL,
  `subquote_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subquotes`
--

INSERT INTO `subquotes` (`subquote_id`, `quote_id`, `subquote_text`, `explanation`, `subquote_number`) VALUES
(1, 1, 'marble halls whispered', 'Personification emphasizing the palace\'s ancient nature', 1),
(2, 1, 'secrets of a thousand years', 'Temporal metaphor suggesting deep history', 2),
(3, 2, 'Shadows danced', 'Animation of inanimate objects suggesting supernatural presence', 1),
(4, 2, 'memories trying to break free', 'Metaphor for historical revelations', 2),
(5, 3, 'silence had a voice', 'Paradox emphasizing the weight of the moment', 1),
(6, 4, 'Stars streaked past', 'Dynamic imagery of space travel', 1),
(7, 4, 'like rain on a windshield', 'Grounding cosmic experience in familiar terms', 2),
(8, 5, 'void between worlds', 'Spatial metaphor for isolation', 1),
(9, 5, 'more questions than answers', 'Commentary on exploration\'s nature', 2),
(10, 7, 'truth was a puzzle', 'Mystery-solving metaphor', 1),
(11, 7, 'missing pieces', 'Incomplete information metaphor', 2),
(12, 8, 'refuse to see', 'Human nature observation', 1),
(13, 9, 'Time was both ally and enemy', 'Paradox of investigation timing', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`tag_id`, `name`) VALUES
(6, 'Adventure'),
(9, 'Drama'),
(1, 'Fantasy'),
(5, 'Historical Fiction'),
(3, 'Mystery'),
(7, 'Philosophy'),
(4, 'Romance'),
(2, 'Science Fiction'),
(8, 'Technology'),
(10, 'Thriller');

-- --------------------------------------------------------

--
-- Table structure for table `userfavorites`
--

CREATE TABLE `userfavorites` (
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userfavorites`
--

INSERT INTO `userfavorites` (`user_id`, `book_id`) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(4, 5);

-- --------------------------------------------------------

--
-- Table structure for table `userratings`
--

CREATE TABLE `userratings` (
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `review` varchar(255) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `rated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userratings`
--

INSERT INTO `userratings` (`user_id`, `book_id`, `review`, `rating`, `rated_at`) VALUES
(1, 1, 'A masterpiece of magical storytelling!', 4.75, '2024-12-05 21:21:29'),
(2, 2, 'Mind-bending space adventure that keeps you guessing', 4.50, '2024-12-05 21:21:29'),
(3, 3, 'Classic detective work with a fresh twist', 4.25, '2024-12-05 21:21:29'),
(4, 4, 'Beautiful and mysterious underwater epic', 4.50, '2024-12-05 21:21:29'),
(5, 5, 'Thought-provoking exploration of consciousness', 4.75, '2024-12-05 21:21:29');

-- --------------------------------------------------------

--
-- Table structure for table `userreadingprogress`
--

CREATE TABLE `userreadingprogress` (
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `last_read_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_completed` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userreadingprogress`
--

INSERT INTO `userreadingprogress` (`user_id`, `book_id`, `chapter_id`, `last_read_at`, `is_completed`) VALUES
(1, 1, 3, '2024-12-05 21:21:29', 0),
(2, 2, 4, '2024-12-05 21:21:29', 1),
(3, 3, 2, '2024-12-05 21:21:29', 0),
(4, 4, 5, '2024-12-05 21:21:29', 1),
(5, 5, 3, '2024-12-05 21:21:29', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `naivePassword` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `naivePassword`, `created_at`, `last_login`) VALUES
(1, 'bookworm', 'bookworm@example.com', 'pass123', '2024-12-05 21:21:29', '2024-12-05 21:21:29'),
(2, 'literaryExplorer', 'explorer@example.com', 'pass456', '2024-12-05 21:21:29', '2024-12-05 21:21:29'),
(3, 'quoteCollector', 'quotes@example.com', 'pass789', '2024-12-05 21:21:29', '2024-12-05 21:21:29'),
(4, 'Twin', 'm@m', 'ayo', '2024-12-05 21:21:29', '2024-12-05 21:21:29'),
(5, 'bang', 'bang@bang', 'bang', '2024-12-05 21:21:29', '2024-12-05 21:21:29'),
(6, 'rosapercs', 'izzyterreno@gmail.com', '123', '2024-12-05 23:02:33', '2024-12-05 23:02:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`book_id`);

--
-- Indexes for table `booktags`
--
ALTER TABLE `booktags`
  ADD PRIMARY KEY (`book_id`,`tag_id`);

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`chapter_id`),
  ADD KEY `fk_chapters_book` (`book_id`);

--
-- Indexes for table `quotes`
--
ALTER TABLE `quotes`
  ADD PRIMARY KEY (`quote_id`),
  ADD KEY `fk_quotes_chapter` (`chapter_id`);

--
-- Indexes for table `subquotes`
--
ALTER TABLE `subquotes`
  ADD PRIMARY KEY (`subquote_id`),
  ADD KEY `fk_subquotes_quote` (`quote_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tag_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `userfavorites`
--
ALTER TABLE `userfavorites`
  ADD PRIMARY KEY (`user_id`,`book_id`),
  ADD KEY `fk_userfavorites_book` (`book_id`);

--
-- Indexes for table `userratings`
--
ALTER TABLE `userratings`
  ADD PRIMARY KEY (`user_id`,`book_id`),
  ADD KEY `fk_userratings_book` (`book_id`);

--
-- Indexes for table `userreadingprogress`
--
ALTER TABLE `userreadingprogress`
  ADD PRIMARY KEY (`user_id`,`book_id`),
  ADD KEY `fk_userreadingprogress_book` (`book_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `book_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `chapters`
--
ALTER TABLE `chapters`
  MODIFY `chapter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `quotes`
--
ALTER TABLE `quotes`
  MODIFY `quote_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `subquotes`
--
ALTER TABLE `subquotes`
  MODIFY `subquote_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booktags`
--
ALTER TABLE `booktags`
  ADD CONSTRAINT `fk_booktags_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE;

--
-- Constraints for table `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `fk_chapters_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE;

--
-- Constraints for table `quotes`
--
ALTER TABLE `quotes`
  ADD CONSTRAINT `fk_quotes_chapter` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`) ON DELETE CASCADE;

--
-- Constraints for table `subquotes`
--
ALTER TABLE `subquotes`
  ADD CONSTRAINT `fk_subquotes_quote` FOREIGN KEY (`quote_id`) REFERENCES `quotes` (`quote_id`) ON DELETE CASCADE;

--
-- Constraints for table `userfavorites`
--
ALTER TABLE `userfavorites`
  ADD CONSTRAINT `fk_userfavorites_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE;

--
-- Constraints for table `userratings`
--
ALTER TABLE `userratings`
  ADD CONSTRAINT `fk_userratings_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE;

--
-- Constraints for table `userreadingprogress`
--
ALTER TABLE `userreadingprogress`
  ADD CONSTRAINT `fk_userreadingprogress_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
