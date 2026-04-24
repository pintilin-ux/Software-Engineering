const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../services/db2");

// 🔹 GET login page
router.get("/login", (req, res) => {
    res.render("login", {
        error: req.query.error
    });
});


router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const rows = await db.query(
            "SELECT userID, password_hash FROM users WHERE username = ?",
            [username]
        );

        if (!rows.length) {
            return res.redirect("/login?error=1");
        }

        const user = rows[0];

        // ✅ TEMP TEST (NO BCRYPT YET)
        const valid = password === user.password_hash;

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


// 🔹 Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;