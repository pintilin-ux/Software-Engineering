SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DELETE FROM likes WHERE userID = 101;
DELETE FROM Events WHERE userID = 101;
DELETE FROM guides WHERE userID = 101;
DELETE FROM users WHERE userID = 101;

INSERT INTO users (
  userID,
  PID,
  username,
  password_hash,
  bio,
  favouriteGame,
  platform,
  joined,
  skillLevel,
  email
) VALUES (
  101,
  NULL,
  'john_doe',
  'hash123',
  'Just a casual player who enjoys learning and sharing beginner-friendly tips.',
  'Fortnite',
  'PC / Console',
  '2026-01-01',
  'Beginner',
  'john@email.com'
);

INSERT INTO guides (
  GID,
  userID,
  title,
  content,
  Genre,
  Skill_level,
  created_at
) VALUES
(
  1011,
  101,
  'How to Play Chess',
  'This guide explains the basics of chess, including piece movement, simple openings, and how to think ahead as a beginner.',
  'Strategy',
  'Beginner',
  '2026-03-01 10:00:00'
),
(
  1012,
  101,
  'Intro to Python',
  'This guide introduces Python basics such as variables, loops, and functions in a simple and beginner-friendly way.',
  'Programming',
  'Beginner',
  '2026-03-03 12:00:00'
);

INSERT INTO likes (userID, GID) VALUES
(101, 1011),
(101, 1012);

INSERT INTO Events (
  EventID,
  userID,
  Event_Name,
  Skill_level,
  date,
  status
) VALUES
(
  2011,
  101,
  'Chess Event',
  'Beginner',
  '2026-04-20',
  'upcoming'
),
(
  2012,
  101,
  'Python Workshop',
  'Beginner',
  '2026-03-20',
  'completed'
);

COMMIT;