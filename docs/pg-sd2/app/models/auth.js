const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../services/db2");

router.get("/login", (req, res) => {
    res.render("login", {
        error: req.query.error,
        redirect: req.query.redirect || ""
    });
});

router.post("/login", async (req, res) => {
    const { username, password, redirect } = req.body;

    try {
        const rows = await db.query(
            "SELECT userID, password_hash FROM users WHERE username = ?",
            [username]
        );

        if (!rows.length) {
            return res.redirect("/login?error=1");
        }

        const user = rows[0];

       
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            return res.redirect("/login?error=1");
        }

       
        req.session.userId = user.userID;

       
        const safeRedirect =
            (redirect && redirect.startsWith('/') && !redirect.startsWith('//'))
                ? redirect
                : '/profile';

        res.redirect(safeRedirect);

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send("Login failed");
    }
});

module.exports = router;


// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/index");
    });
});

module.exports = router;