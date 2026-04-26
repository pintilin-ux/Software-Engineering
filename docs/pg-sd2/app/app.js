// Import express.js
const express = require("express");
const session = require("express-session");
const bcrypt = require ("bcryptjs");

// Create express app
const app = express();

app.use(express.urlencoded({ extended: true}));

app.use(session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

app.use((req,res,next) => {
    res.locals.Logged = !!req.session.userId;
    next();
});


// Add static files location
app.use(express.static("static"));

// Use the Pug templating engine
app.set("view engine", "pug");
app.set("views", "./app/views");

// Get the functions in the db.js file to use
const db = require("./services/db");
const db2 = require("./services/db2");

const { Guide } = require("./models/guide");
const { router: eventsRouter } = require("./models/events");
const authRoutes = require("./models/auth");


app.use("/events", eventsRouter);

app.use("/", authRoutes);

// Create a route for root - /
app.get("/", function (req, res) {
    res.send("Hello world!");
});

// Create a route for /guides
app.get("/guides", async function (req, res) {
    try {
        const search = req.query.search || "";
        const skillLevel = req.query.skillLevel || "All";
        const genre = req.query.genre || "All";

        const guides = await Guide.getFilteredGuides(search, skillLevel, genre);
        const userId = req.session.userId;

        for (let guide of guides) {
            await guide.getLikes();
            guide.likedByUser = await guide.hasUserLiked(userId);
        }

        res.render("guides", {
            guides: guides,
            search: search,
            skillLevel: skillLevel,
            genre: genre
        });
    } catch (err) {
        console.error("Error loading guides:", err);
        res.status(500).send("Failed to load guides.");
    }
});

// Create a route for /guide-details/:id
app.get("/guide-details/:id", async function (req, res) {
    try {
        const gId = req.params.id;
        const guide = new Guide(gId);
        const userId = req.session.userId;

        await guide.getGuideDetails();
        await guide.getComments();
        await guide.getLikes();
        guide.likedByUser = await guide.hasUserLiked(userId);

        res.render("guide-details", { guide: guide });
    } catch (err) {
        console.error("Error loading guide details:", err);
        res.status(500).send("Failed to load guide details.");
    }
});

app.post("/like/:gid", async function (req, res) {
    const userId = req.session.userId;
    const gid = req.params.gid;

    if (!userId) {
        return res.status(401).json({ error: "Login required" });
    }

    const check = await db2.query(
        "SELECT * FROM likes WHERE userID = ? AND GID = ?",
        [userId, gid]
    );

    if (check.length > 0) {
        // UNLIKE
        await db2.query(
            "DELETE FROM likes WHERE userID = ? AND GID = ?",
            [userId, gid]
        );
        res.json({ liked: false });
    } else {
        // LIKE
        await db2.query(
            "INSERT INTO likes (userID, GID) VALUES (?, ?)",
            [userId, gid]
        );
        res.json({ liked: true });
    }
});

app.post("/guide-details/:id/comment", async (req, res) => {
    const userId = req.session.userId;
    const gid = req.params.id;
    const { comment } = req.body;

    if (!userId) {
        return res.status(401).send("Login required");
    }

    if (!comment || comment.trim() === "") {
        return res.redirect(`/guide-details/${gid}`);
    }

    try {
        await db2.query(
            "INSERT INTO comments (userID, GID, comment, created_at) VALUES (?, ?, ?, NOW())",
            [userId, gid, comment]
        );

        res.redirect(`/guide-details/${gid}`);
    } catch (err) {
        console.error("COMMENT ERROR:", err);
        res.status(500).send("Error adding comment");
    }
});

// Create a route for /profile
app.get("/profile", async function (req, res) {
    try {
        const userId = req.session.userId;

        if(!userId){
            return res.redirect("/login");
        }

        // 1. User info
        const userRows = await db.query(`
            SELECT userID, username, bio, favouriteGame, platform, joined, skillLevel
            FROM users
            WHERE userID = ?
        `, [userId]);

        if (!userRows || userRows.length === 0) {
            return res.status(404).send("User not found.");
        }

        // 2. Stats
        const createdRows = await db.query(`
            SELECT COUNT(*) AS tipsCreated
            FROM guides
            WHERE userID = ?
        `, [userId]);

        const likedRows = await db.query(`
            SELECT COUNT(*) AS tipsLiked
            FROM likes
            WHERE userID = ?
        `, [userId]);

        // 3. Tips created by user
        const tipsRows = await db.query(`
            SELECT GID, title, content, Genre, Skill_level, created_at
            FROM guides
            WHERE userID = ?
            ORDER BY created_at DESC
        `, [userId]);

        // 4. Events
        const upcomingEventRows = await db.query(`
            SELECT Event_Name, date, Skill_level, status
            FROM Events
            WHERE userID = ? AND status = 'upcoming'
            ORDER BY date ASC
        `, [userId]);

        const completedEventRows = await db.query(`
            SELECT Event_Name, date, Skill_level, status
            FROM Events
            WHERE userID = ? AND status = 'completed'
            ORDER BY date DESC
        `, [userId]);

        const user = {
            username: userRows[0].username || "Unknown User",
            email: "username@email.com",
            bio: userRows[0].bio || "No bio yet",
            joined: userRows[0].joined
                ? new Date(userRows[0].joined).toLocaleDateString("en-GB")
                : "Unknown",
            favouriteGame: userRows[0].favouriteGame || "Unknown",
            skillLevel: userRows[0].skillLevel || "Unknown",
            platform: userRows[0].platform || "Unknown"
        };

        const stats = {
            tipsCreated: createdRows[0]?.tipsCreated || 0,
            tipsSaved: 0,
            tipsLiked: likedRows[0]?.tipsLiked || 0
        };

        const formattedTips = tipsRows.map((tip) => ({
            title: tip.title || "Untitled Tip",
            game: tip.Genre || "Unknown",
            date: tip.created_at
                ? new Date(tip.created_at).toLocaleDateString("en-GB")
                : "No date",
            summary: tip.content
                ? tip.content.substring(0, 120) + (tip.content.length > 120 ? "..." : "")
                : "No summary available"
        }));

        const upcomingEvents = upcomingEventRows.map((event) => ({
            name: event.Event_Name || "Untitled Event",
            date: event.date
                ? new Date(event.date).toLocaleDateString("en-GB")
                : "No date",
            skillLevel: event.Skill_level || "Unknown",
            status: event.status || "Unknown"
        }));

        const completedEvents = completedEventRows.map((event) => ({
            name: event.Event_Name || "Untitled Event",
            date: event.date
                ? new Date(event.date).toLocaleDateString("en-GB")
                : "No date",
            skillLevel: event.Skill_level || "Unknown",
            status: event.status || "Unknown"
        }));

        // Activity boxes based on real profile data
        const activityData = [
            stats.tipsCreated,
            stats.tipsLiked,
            upcomingEvents.length,
            completedEvents.length,
            formattedTips.length > 0 ? 1 : 0,
            user.bio && user.bio !== "No bio yet" ? 1 : 0,
            user.favouriteGame !== "Unknown" ? 1 : 0,
            user.platform !== "Unknown" ? 1 : 0
        ];

        const maxActivity = Math.max(...activityData, 1);

        const activityBoxes = activityData.map((value) => {
            const level = Math.max(1, Math.ceil((value / maxActivity) * 4));
            return {
                value,
                level
            };
        });

        res.render("profile", {
            user,
            stats,
            tips: formattedTips,
            upcomingEvents,
            completedEvents,
            activityBoxes
        });
    } catch (err) {
        console.error("Error loading profile page:", err);
        res.status(500).send("Failed to load profile page.");
    }
});

// Create a route for /videos AND API
app.get("/videos", async function(req, res) {
    const search = req.query.search || "";
    let videos = [];

    if (search.trim() !== "") {
        const apiKey = process.env.YOUTUBE_API_KEY;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(search)}&type=video&maxResults=6&key=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        videos = data.items.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title
        }));
    }

    res.render("videos", { videos, search });
});


// Create a route for /about
app.get("/about", function (req, res) {
    res.render("about");
});

// Create a route for /index
app.get("/index", function (req, res) {
    res.render("index");
});

app.get("/videos", function (req, res) {
    res.render("videos");
});

app.get("/cw-users", async function (req, res) {
    try {
        const users = await db2.query("SELECT * FROM users");
        res.json(users);
    } catch (err) {
        console.error("Error loading cw-users:", err);
        res.status(500).send(err.message);
    }
});

// Create a route for testing the db
app.get("/db_test", function (req, res) {
    const sql = "SELECT * FROM test_table";

    db.query(sql).then((results) => {
        console.log(results);
        res.send(results);
    }).catch((err) => {
        console.error("Database test failed:", err);
        res.status(500).send(err.message);
    });
});

// Start server on port 3000
app.listen(3000, function () {
    console.log("Server running at http://127.0.0.1:3000/");
});