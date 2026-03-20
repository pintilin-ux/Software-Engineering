CREATE TABLE customer (
  PID INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  surname VARCHAR(50) NOT NULL,
  email_address VARCHAR(255) UNIQUE NOT NULL,
  birth DATE
);

CREATE TABLE users (
  userID INTEGER PRIMARY KEY,
  PID INTEGER,
  username VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT,
  FOREIGN KEY (PID) REFERENCES customer(PID)
);

create table Events(
EventID INTEGER PRIMARY key,
userID INTEGER,
Event_Name VARCHAR(100),
Skill_level VARCHAR(20),
date DATE,
FOREIGN KEY(userID) REFERENCES users(userID)
);

CREATE TABLE guides (
  GID INTEGER PRIMARY KEY,
  userID INTEGER,
  title VARCHAR(100),
  content TEXT,
  Genre VARCHAR(20),
  Skill_level VARCHAR(20),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE likes (
  userID INTEGER,
  GID INTEGER,
  PRIMARY KEY (userID, GID),
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
  FOREIGN KEY (GID) REFERENCES guides(GID) ON DELETE CASCADE
);

CREATE TABLE comments (
  CMID INTEGER PRIMARY KEY,
  userID INTEGER,
  GID INTEGER,
  comment TEXT,
  created_at DATETIME,
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
  FOREIGN KEY (GID) REFERENCES guides(GID) ON DELETE CASCADE
);


INSERT INTO customer (PID, name, surname, email_address, birth)VALUES
(1, 'Clark', 'Sales', 'clark.sales@example.com', '2000-10-10'),
(2, 'Emma', 'Johnson', 'emma.johnson@example.com', '1999-04-21'),
(3, 'Liam', 'Williams', 'liam.williams@example.com', '2001-01-15'), 
(4, 'Olivia', 'Brown', 'olivia.brown@example.com', '1998-07-30'),
(5, 'Noah', 'Jones', 'noah.jones@example.com', '2002-11-05'),
(6, 'Ava', 'Garcia', 'ava.garcia@example.com', '2000-03-18'),
(7, 'Ethan', 'Miller', 'ethan.miller@example.com', '1997-09-12'),
(8, 'Sophia', 'Davis', 'sophia.davis@example.com', '2001-06-25');


INSERT INTO users (userID, PID, username, password_hash, bio) VALUES
(101,1, 'john_doe', 'hash123', 'Just a casual user'),
(102,2, 'jane_smith', 'hash456', 'Loves events and guides'),
(103,3, 'noob_master', 'hash789', 'Beginner trying stuff'),
(104,4, 'pro_gamer', 'hash999', 'Expert level player');


INSERT INTO Events (EventID, userID, Event_Name, Skill_level, date) VALUES
(1, 101, 'Chess Tournament', 'Beginner', '2026-04-01'),
(2, 102, 'Cooking Class', 'Intermediate', '2026-04-05'),
(3, 103, 'Coding Bootcamp', 'Beginner', '2026-04-10'),
(4, 104, 'Pro Gaming Finals', 'Advanced', '2026-04-15');



INSERT INTO guides (GID, userID, title, content, Genre, Skill_level, created_at) VALUES
(1, 101, 'How to Play Chess',
'Chess is a strategic board game that has been played for centuries and continues to be popular around the world. This guide will walk you through the fundamentals of the game, including the rules, the pieces, and some basic strategies to help you get started. At the beginning, it is important to understand how each piece moves. The pawn moves forward but captures diagonally, while the rook moves in straight lines across the board. Knights move in an L-shape, bishops move diagonally, and the queen combines the power of the rook and bishop. The king moves one square in any direction and must be protected at all costs. Once you understand how the pieces move, the next step is to learn the objective of the game. The goal in chess is to checkmate your opponent’s king, meaning the king is under attack and cannot escape. To achieve this, players must think several moves ahead and anticipate their opponent’s responses. Opening strategies are important because they help you control the center of the board and develop your pieces efficiently. Controlling the center allows your pieces to move more freely and puts pressure on your opponent. As the game progresses into the middle phase, players should focus on coordinating their pieces and creating threats. This is where tactics such as forks, pins, and skewers become useful. Practicing these patterns can greatly improve your gameplay. In the endgame, fewer pieces remain on the board, and the focus shifts to promoting pawns and positioning the king effectively. Endgames require precision and patience.
Practice is essential for improving at chess. Playing regularly, reviewing your games, and learning from mistakes will help you become a stronger player over time. Watching experienced players and studying classic games can also provide valuable insights. While it may seem complex at first, chess becomes more enjoyable as you gain confidence and understanding. Remember that every game is a learning opportunity, and even losses can teach you important lessons. With time and dedication, you will develop your skills and begin to see patterns and strategies more clearly. Continue practicing and enjoy the process of learning this timeless game.',
'Strategy', 'Beginner', '2026-03-01 10:00:00'),

(2, 102, 'Basic Cooking Tips',
'Cooking is an essential life skill that allows you to prepare meals, experiment with flavors, and enjoy the process of creating something from scratch. This guide introduces some basic cooking tips that can help beginners feel more comfortable in the kitchen. First, always read a recipe thoroughly before starting. This helps you understand the steps and ensures you have all the necessary ingredients prepared. Preparation is key in cooking. Washing, chopping, and measuring ingredients before you begin can make the process smoother and more enjoyable. This technique, often called mise en place, helps you stay organized and reduces stress. Another important tip is to control your heat. Cooking at the right temperature prevents burning and ensures your food cooks evenly. For example, low heat is ideal for simmering, while high heat is useful for searing. Seasoning is another critical aspect of cooking. Salt enhances flavor, but it should be used carefully. Tasting your food as you cook allows you to adjust seasoning gradually. Herbs and spices can add depth and complexity to your dishes. Experimenting with different combinations can help you discover new flavors you enjoy. Cleanliness is also important in the kitchen. Keeping your workspace tidy and washing utensils as you go can save time and prevent cross-contamination. Food safety should always be a priority, especially when handling raw meat. Proper storage and cooking temperatures help prevent foodborne illnesses.
As you gain confidence, try experimenting with recipes and making small adjustments to suit your taste. Cooking is both a science and an art, and mistakes are part of the learning process. Over time, you will develop your own style and preferences. With practice and patience, cooking can become an enjoyable and rewarding activity that allows you to share meals with others and express your creativity.',
'Cooking', 'Beginner', '2026-03-02 11:00:00'),

(3, 103, 'Intro to Python',
'Python is a versatile and beginner-friendly programming language that is widely used in various fields, including web development, data analysis, and automation. This guide provides an introduction to Python and its basic concepts. To get started, you need to install Python on your computer and set up a development environment. Once installed, you can write and execute Python code using a simple text editor or an integrated development environment. One of the first things to learn in Python is how to use variables. Variables store data that can be used and manipulated in your program. Python supports different data types, such as integers, floats, strings, and booleans. Understanding these data types is essential for writing effective code. Control structures, such as if statements and loops, allow you to control the flow of your program and perform repetitive tasks efficiently. Functions are another important concept in Python. They allow you to organize your code into reusable blocks, making it easier to manage and maintain. Writing clean and readable code is a valuable skill that improves collaboration and reduces errors. Python’s syntax is designed to be simple and intuitive, which makes it a great choice for beginners. As you progress, you can explore more advanced topics, such as working with files, handling exceptions, and using libraries. Python has a large community and a wealth of resources available online, making it easy to find help and learn new skills. Practice is key to becoming proficient in programming. By working on small projects and gradually increasing their complexity, you can build confidence and develop problem-solving skills.
Programming can be challenging at times, but persistence and curiosity will help you overcome obstacles. Python provides a solid foundation for learning other programming languages and concepts. With dedication and consistent practice, you can use Python to create useful applications and explore new opportunities in technology.',
'Programming', 'Beginner', '2026-03-03 12:00:00'),

(4, 104, 'Advanced Gaming Tactics',
'Competitive gaming requires a combination of skill, strategy, and mental focus. This guide explores advanced tactics that can help players improve their performance and gain an edge over their opponents. One of the most important aspects of gaming is understanding the mechanics of the game you are playing. Mastery of controls, timing, and positioning is essential for success. Situational awareness is another critical skill. Being aware of your surroundings, including enemy positions and objectives, allows you to make better decisions. Communication with teammates is also important in team-based games. Clear and concise communication can improve coordination and increase your chances of winning. Practice is essential for mastering advanced tactics. Repetition helps build muscle memory and improves reaction time. Reviewing your gameplay and analyzing mistakes can provide valuable insights. Many professional players spend time studying strategies and learning from others in the community. Adaptability is key in competitive gaming. Each match is different, and being able to adjust your strategy based on the situation is crucial. This may involve changing your playstyle, experimenting with new tactics, or learning from your opponents. Staying calm under pressure is also important, as stress can negatively impact performance. 
Finally, maintaining a healthy balance between gaming and other aspects of life is important. Taking breaks, staying physically active, and getting enough rest can improve focus and overall well-being. By combining skill, strategy, and discipline, players can continue to improve and achieve their goals in competitive gaming.',
'Gaming', 'Advanced', '2026-03-04 13:00:00');

INSERT INTO likes (userID, GID) VALUES
(101, 1),
(101, 2),
(102, 1),
(102, 3),
(103, 1),
(103, 2),
(103, 3),
(104, 1),
(104, 2),
(104, 3),
(104, 4);

INSERT INTO comments (CMID, userID, GID, comment, created_at) VALUES
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


SELECT * FROM users;
select * from likes;
select * from guides;
select * from comments;
select * from customer;
select * from events;

