const express = require("express");
const path = require("path");

const app = express();
const PORT = 3002;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.redirect("/profile");
});

app.get("/profile", (req, res) => {
    const user = {
        username: "ProGamer123",
        email: "username@email.com",
        bio: "Beginner Fortnite player who enjoys sharing practical tips with the community.",
        favouriteGame: "Fortnite",
        skillLevel: "Beginner",
        platform: "PC / Console",
        joined: "January 2026"
    };

    const stats = {
        tipsCreated: 12,
        tipsSaved: 5,
        tipsLiked: 20
    };

    const tips = [
        {
            title: "How to win boss fight",
            game: "Elden Ring",
            date: "Feb 2026",
            summary: "A short guide explaining positioning, timing and stamina control during difficult boss fights."
        },
        {
            title: "Beginner guide to building in Fortnite",
            game: "Fortnite",
            date: "Jan 2026",
            summary: "A starter guide for new players learning defensive walls, ramps and simple build combinations."
        },
        {
            title: "Best loadout tips for ranked matches",
            game: "Call of Duty",
            date: "Mar 2026",
            summary: "Suggested weapon combinations and practical loadout choices for competitive online matches."
        }
    ];

    res.render("profile", { user, stats, tips });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});