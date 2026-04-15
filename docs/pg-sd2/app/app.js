// Import express.js
const express = require("express");

// Create express app
const app = express();

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

app.use("/events", eventsRouter);

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

        await guide.getGuideDetails();
        await guide.getComments();

        res.render("guide-details", { guide: guide });
    } catch (err) {
        console.error("Error loading guide details:", err);
        res.status(500).send("Failed to load guide details.");
    }
});

// Create a route for /profile
app.get("/profile", async function (req, res) {
    try {
        const userId = 101;

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
        const upcomingEvents = await db.query(`
            SELECT Event_Name, date, Skill_level, status
            FROM Events
            WHERE userID = ? AND status = 'upcoming'
            ORDER BY date ASC
        `, [userId]);

        const completedEvents = await db.query(`
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

        res.render("profile", {
            user,
            stats,
            tips: formattedTips,
            upcomingEvents,
            completedEvents
        });
    } catch (err) {
        console.error("Error loading profile page:", err);
        res.status(500).send("Failed to load profile page.");
    }
});

// Create a route for /about
app.get("/about", function (req, res) {
    res.render("about");
});

// Create a route for /index
app.get("/index", function (req, res) {
    res.render("index");
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

// Create a route for /goodbye
app.get("/goodbye", function (req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/:name
app.get("/hello/:name", function (req, res) {
    console.log(req.params);
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000, function () {
    console.log("Server running at http://127.0.0.1:3000/");
});