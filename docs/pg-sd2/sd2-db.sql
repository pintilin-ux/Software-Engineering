-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Apr 22, 2026 at 05:49 PM
-- Server version: 9.6.0
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `CMID` int NOT NULL,
  `userID` int DEFAULT NULL,
  `GID` int DEFAULT NULL,
  `comment` text,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`CMID`, `userID`, `GID`, `comment`, `created_at`) VALUES
(1, 101, 1, 'Great guide, really helped me understand the basics!', '2026-03-05 10:15:00'),
(2, 102, 1, 'Nice explanation, especially the part about openings.', '2026-03-05 11:20:00'),
(3, 103, 2, 'Super useful tips, I actually tried them today.', '2026-03-06 09:10:00'),
(4, 104, 4, 'Good advanced strategies, pretty solid.', '2026-03-06 14:45:00'),
(5, 101, 3, 'Python seems less scary now, thanks!', '2026-03-07 08:30:00'),
(6, 102, 2, 'Simple and clear, perfect for beginners.', '2026-03-07 12:00:00'),
(7, 103, 3, 'I liked the examples, very easy to follow.', '2026-03-08 16:25:00'),
(8, 104, 1, 'Chess guide is decent, could add more tactics.', '2026-03-08 18:40:00'),
(9, 101, 4, 'Gaming tips are actually useful, nice work.', '2026-03-09 13:10:00'),
(10, 102, 3, 'Good intro, would love more advanced stuff next.', '2026-03-09 15:55:00');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE IF NOT EXISTS `customer` (
  `PID` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `birth` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`PID`, `name`, `surname`, `email_address`, `birth`) VALUES
(1, 'Clark', 'Sales', 'clark.sales@example.com', '2000-10-10'),
(2, 'Emma', 'Johnson', 'emma.johnson@example.com', '1999-04-21'),
(3, 'Liam', 'Williams', 'liam.williams@example.com', '2001-01-15'),
(4, 'Olivia', 'Brown', 'olivia.brown@example.com', '1998-07-30'),
(5, 'Noah', 'Jones', 'noah.jones@example.com', '2002-11-05'),
(6, 'Ava', 'Garcia', 'ava.garcia@example.com', '2000-03-18'),
(7, 'Ethan', 'Miller', 'ethan.miller@example.com', '1997-09-12'),
(8, 'Sophia', 'Davis', 'sophia.davis@example.com', '2001-06-25');

-- --------------------------------------------------------

--
-- Table structure for table `Events`
--

CREATE TABLE IF NOT EXISTS `Events` (
  `EventID` int NOT NULL,
  `userID` int DEFAULT NULL,
  `Event_Name` varchar(100) DEFAULT NULL,
  `Skill_level` varchar(20) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Events`
--

INSERT INTO `Events` (`EventID`, `userID`, `Event_Name`, `Skill_level`, `date`, `status`) VALUES
(1, 101, 'Chess Event', 'Beginner', '2026-04-01', 'upcoming'),
(2, 102, 'Cooking Class', 'Intermediate', '2026-05-05', 'upcoming'),
(3, 103, 'Coding Bootcamp', 'Beginner', '2026-04-10', 'completed'),
(4, 104, 'Pro Gaming Finals', 'Advanced', '2026-04-15', 'completed'),
(5, 101, 'Valorant Champions Cup', 'Advanced', '2026-05-10', 'upcoming'),
(6, 102, 'League of Legends Clash', 'Intermediate', '2026-05-17', 'upcoming'),
(7, 103, 'Fortnite Friday Tournament', 'Beginner', '2026-05-24', 'upcoming'),
(8, 104, 'Call of Duty: Warzone Open', 'Advanced', '2026-06-01', 'upcoming'),
(9, 101, 'Apex Legends Global Series', 'Intermediate', '2026-06-08', 'upcoming'),
(10, 102, 'CS2 Open Cup', 'Advanced', '2026-06-15', 'upcoming'),
(11, 103, 'Minecraft Build Battle', 'Beginner', '2026-06-22', 'upcoming'),
(12, 104, 'Overwatch 2 League', 'Intermediate', '2026-07-05', 'upcoming'),
(13, 101, 'Rocket League Championship', 'Advanced', '2026-07-12', 'upcoming');

-- --------------------------------------------------------

--
-- Table structure for table `guides`
--

CREATE TABLE IF NOT EXISTS `guides` (
  `GID` int NOT NULL,
  `userID` int DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text,
  `Genre` varchar(20) DEFAULT NULL,
  `Skill_level` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `guides`
--

INSERT INTO `guides` (`GID`, `userID`, `title`, `content`, `Genre`, `Skill_level`, `created_at`) VALUES
(1, 101, 'How to Play Chess', 'Chess is a strategic board game that has been played for centuries and continues to be popular around the world. This guide will walk you through the fundamentals of the game, including the rules, the pieces, and some basic strategies to help you get started. At the beginning, it is important to understand how each piece moves. The pawn moves forward but captures diagonally, while the rook moves in straight lines across the board. Knights move in an L-shape, bishops move diagonally, and the queen combines the power of the rook and bishop. The king moves one square in any direction and must be protected at all costs. Once you understand how the pieces move, the next step is to learn the objective of the game. The goal in chess is to checkmate your opponent’s king, meaning the king is under attack and cannot escape. To achieve this, players must think several moves ahead and anticipate their opponent’s responses. Opening strategies are important because they help you control the center of the board and develop your pieces efficiently. Controlling the center allows your pieces to move more freely and puts pressure on your opponent. As the game progresses into the middle phase, players should focus on coordinating their pieces and creating threats. This is where tactics such as forks, pins, and skewers become useful. Practicing these patterns can greatly improve your gameplay. In the endgame, fewer pieces remain on the board, and the focus shifts to promoting pawns and positioning the king effectively. Endgames require precision and patience.\r\nPractice is essential for improving at chess. Playing regularly, reviewing your games, and learning from mistakes will help you become a stronger player over time. Watching experienced players and studying classic games can also provide valuable insights. While it may seem complex at first, chess becomes more enjoyable as you gain confidence and understanding. Remember that every game is a learning opportunity, and even losses can teach you important lessons. With time and dedication, you will develop your skills and begin to see patterns and strategies more clearly. Continue practicing and enjoy the process of learning this timeless game.', 'Strategy', 'Beginner', '2026-03-01 10:00:00'),
(2, 102, 'Basic Cooking Tips', 'Cooking is an essential life skill that allows you to prepare meals, experiment with flavors, and enjoy the process of creating something from scratch. This guide introduces some basic cooking tips that can help beginners feel more comfortable in the kitchen. First, always read a recipe thoroughly before starting. This helps you understand the steps and ensures you have all the necessary ingredients prepared. Preparation is key in cooking. Washing, chopping, and measuring ingredients before you begin can make the process smoother and more enjoyable. This technique, often called mise en place, helps you stay organized and reduces stress. Another important tip is to control your heat. Cooking at the right temperature prevents burning and ensures your food cooks evenly. For example, low heat is ideal for simmering, while high heat is useful for searing. Seasoning is another critical aspect of cooking. Salt enhances flavor, but it should be used carefully. Tasting your food as you cook allows you to adjust seasoning gradually. Herbs and spices can add depth and complexity to your dishes. Experimenting with different combinations can help you discover new flavors you enjoy. Cleanliness is also important in the kitchen. Keeping your workspace tidy and washing utensils as you go can save time and prevent cross-contamination. Food safety should always be a priority, especially when handling raw meat. Proper storage and cooking temperatures help prevent foodborne illnesses.\r\nAs you gain confidence, try experimenting with recipes and making small adjustments to suit your taste. Cooking is both a science and an art, and mistakes are part of the learning process. Over time, you will develop your own style and preferences. With practice and patience, cooking can become an enjoyable and rewarding activity that allows you to share meals with others and express your creativity.', 'Cooking', 'Beginner', '2026-03-02 11:00:00'),
(3, 103, 'Intro to Python', 'Python is a versatile and beginner-friendly programming language that is widely used in various fields, including web development, data analysis, and automation. This guide provides an introduction to Python and its basic concepts. To get started, you need to install Python on your computer and set up a development environment. Once installed, you can write and execute Python code using a simple text editor or an integrated development environment. One of the first things to learn in Python is how to use variables. Variables store data that can be used and manipulated in your program. Python supports different data types, such as integers, floats, strings, and booleans. Understanding these data types is essential for writing effective code. Control structures, such as if statements and loops, allow you to control the flow of your program and perform repetitive tasks efficiently. Functions are another important concept in Python. They allow you to organize your code into reusable blocks, making it easier to manage and maintain. Writing clean and readable code is a valuable skill that improves collaboration and reduces errors. Python’s syntax is designed to be simple and intuitive, which makes it a great choice for beginners. As you progress, you can explore more advanced topics, such as working with files, handling exceptions, and using libraries. Python has a large community and a wealth of resources available online, making it easy to find help and learn new skills. Practice is key to becoming proficient in programming. By working on small projects and gradually increasing their complexity, you can build confidence and develop problem-solving skills.\r\nProgramming can be challenging at times, but persistence and curiosity will help you overcome obstacles. Python provides a solid foundation for learning other programming languages and concepts. With dedication and consistent practice, you can use Python to create useful applications and explore new opportunities in technology.', 'Programming', 'Beginner', '2026-03-03 12:00:00'),
(4, 104, 'Advanced Gaming Tactics', 'Competitive gaming requires a combination of skill, strategy, and mental focus. This guide explores advanced tactics that can help players improve their performance and gain an edge over their opponents. One of the most important aspects of gaming is understanding the mechanics of the game you are playing. Mastery of controls, timing, and positioning is essential for success. Situational awareness is another critical skill. Being aware of your surroundings, including enemy positions and objectives, allows you to make better decisions. Communication with teammates is also important in team-based games. Clear and concise communication can improve coordination and increase your chances of winning. Practice is essential for mastering advanced tactics. Repetition helps build muscle memory and improves reaction time. Reviewing your gameplay and analyzing mistakes can provide valuable insights. Many professional players spend time studying strategies and learning from others in the community. Adaptability is key in competitive gaming. Each match is different, and being able to adjust your strategy based on the situation is crucial. This may involve changing your playstyle, experimenting with new tactics, or learning from your opponents. Staying calm under pressure is also important, as stress can negatively impact performance. \r\nFinally, maintaining a healthy balance between gaming and other aspects of life is important. Taking breaks, staying physically active, and getting enough rest can improve focus and overall well-being. By combining skill, strategy, and discipline, players can continue to improve and achieve their goals in competitive gaming.', 'Gaming', 'Advanced', '2026-03-04 13:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE IF NOT EXISTS `likes` (
  `userID` int NOT NULL,
  `GID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`userID`, `GID`) VALUES
(101, 1),
(102, 1),
(103, 1),
(104, 1),
(101, 2),
(103, 2),
(104, 2),
(102, 3),
(103, 3),
(104, 3),
(104, 4);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `userID` int NOT NULL,
  `PID` int DEFAULT NULL,
  `username` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `bio` text,
  `favouriteGame` varchar(50) DEFAULT NULL,
  `platform` varchar(50) DEFAULT NULL,
  `joined` date DEFAULT NULL,
  `skillLevel` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `PID`, `username`, `password_hash`, `bio`, `favouriteGame`, `platform`, `joined`, `skillLevel`, `email`) VALUES
(101, 1, 'john_doe', 'hash123', 'Just a casual user', 'Fortnite', 'PC / Console', '2026-01-01', 'Beginner', 'john@email.com'),
(102, 2, 'jane_smith', 'hash456', 'Loves events and guides', 'Valorant', 'PC', '2025-12-10', 'Intermediate', NULL),
(103, 3, 'noob_master', 'hash789', 'Beginner trying stuff', 'Call of Duty', 'PlayStation', '2025-11-20', 'Beginner', NULL),
(104, 4, 'pro_gamer', 'hash999', 'Expert level player', 'CS GO', 'PC', '2025-10-05', 'Advanced', NULL),
(105, NULL, 'pakize_test', '$2b$10$kC/VF1snO7.Z8uprvgAiSuIL5H4/na8wfL616F28nkT5kNaidHOqe', 'No bio yet', 'Unknown', 'Unknown', '2026-04-16', 'Beginner', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`CMID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `GID` (`GID`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`PID`),
  ADD UNIQUE KEY `email_address` (`email_address`);

--
-- Indexes for table `Events`
--
ALTER TABLE `Events`
  ADD PRIMARY KEY (`EventID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `guides`
--
ALTER TABLE `guides`
  ADD PRIMARY KEY (`GID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`userID`,`GID`),
  ADD KEY `GID` (`GID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `PID` (`PID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`GID`) REFERENCES `guides` (`GID`) ON DELETE CASCADE;

--
-- Constraints for table `Events`
--
ALTER TABLE `Events`
  ADD CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`);

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`GID`) REFERENCES `guides` (`GID`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `customer` (`PID`);

--
-- Table structure for table `event_registrations`
-- (created after PKs are set on Events and users)
--

CREATE TABLE IF NOT EXISTS `event_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `EventID` int NOT NULL,
  `userID` int NOT NULL,
  `registered_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_registration` (`EventID`, `userID`),
  KEY `userID` (`userID`),
  CONSTRAINT `er_event_fk` FOREIGN KEY (`EventID`) REFERENCES `Events` (`EventID`),
  CONSTRAINT `er_user_fk` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
