// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');
const db2 = require('./services/db2');

const { Guide } = require("./models/guide");

const { router: eventsRouter } = require('./models/events');
app.use('/events', eventsRouter);

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

// Create a route for root - /guides
app.get("/guides", async function(req, res) {
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
});


// Create a route for root - /guide details
app.get("/guide-details/:id", async function(req, res) {
    var gId = req.params.id;
    var guide = new Guide(gId);
    await guide.getGuideDetails();
    await guide.getComments();
    res.render("guide-details", { guide: guide });
});

// Create a route for root - /profile
app.get("/profile", async function (req, res) {
    try {
        const userId = 101;

        const userRows = await db.query(`
            SELECT userID, username, bio
            FROM users
            WHERE userID = ?
        `, [userId]);

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

        const upcomingEvents = await db.query(`
            SELECT Event_Name, date
            FROM Events
            WHERE userID = ?
            ORDER BY date ASC
        `, [userId]);

        const completedEvents = await db.query(`
            SELECT Event_Name, date
            FROM Events
            WHERE userID = ?
            ORDER BY date DESC
        `, [userId]);

        const user = userRows[0];
        
        const stats = {
            tipsCreated: createdRows[0].tipsCreated,
            tipsSaved: 0,
            tipsLiked: likedRows[0].tipsLiked
        };

        res.render("profile", {
            user,
            stats,
            upcomingEvents,
            completedEvents
        });

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Create a route for root - /videos
app.get("/videos", function (req, res) {
    res.render("videos");
});

// Create a route for root - /about
app.get("/about", function (req, res) {
    res.render("about");
});

// Create a route for root - /index
app.get("/index", function (req, res) {
    res.render("index");
});

app.get("/cw-users", async function(req, res) {
    try {
        const users = await db2.query('SELECT * FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});