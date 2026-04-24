const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../services/db");

router.get("/login", (req, res) => {
    res.render("login");
});


router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const rows = await db.query(
            "SELECT userID, passwordHash FROM users WHERE username = ?",
            [username]
        );

        if (!rows.length) {
            return res.redirect("/login?error=1");
        }

        const user = rows[0];

        // ✅ HERE is your test logic
        let valid = false;

        if (user.passwordHash.startsWith("$2a$")) {
            valid = await bcrypt.compare(password, user.passwordHash);
        } else {
            valid = password === user.passwordHash;
        }

        if (!valid) {
            return res.redirect("/login?error=1");
        }

        req.session.userId = user.userID;

        res.redirect("/profile");

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send("Login failed");
    }
});


router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;