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
const { Event } = require("./models/events");


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

app.get("/events", async function(req, res) {
    try {
        const rawEvents = await Event.getAll();
        // Normalise field names so the template works with old schema
        const events = rawEvents.map(e => ({
            ...e,
            id:          e.id       || e.EventID,
            title:       e.title    || e.Event_Name,
            description: e.description || e.Skill_level || '',
            start_date:  e.start_date  || e.date || null,
            game_name:   e.game_name   || null,
            game_slug:   e.game_slug   || null,
            prize:       e.prize       || null,
            participant_count: e.participant_count || 0,
            max_participants:  e.max_participants  || 100,
        }));

        const featured = events[0] || null;
        const rest = featured ? events.slice(1) : events;

        let games = [];
        try { games = await db2.query('SELECT id, name, slug FROM games ORDER BY name'); } catch(e) {}

        let activePlayers = 0, weekEvents = 0;
        try { activePlayers = (await db2.query('SELECT COUNT(*) AS c FROM event_registrations'))[0]?.c || 0; } catch(e) {}
        try { weekEvents = (await db2.query('SELECT COUNT(*) AS c FROM Events'))[0]?.c || 0; } catch(e) {}

        const highlights = {
            topGame: 'Valorant',
            activePlayers,
            weekEvents,
            topPrize: '1000 pts'
        };

        res.render('events', { featured, events: rest, games, highlights });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/events/:id", async function(req, res) {
    try {
        const id = req.params.id;
        const event = await Event.getById(id);
        res.render('event-single', { event });
    } catch (err) {
        res.status(500).send(err.message);
    }
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
app.get("/profile", function (req, res) {
    res.render("profile");
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