const express = require('express');
const db2 = require('../services/db2');

class Event {

    static async getAll() {
        return await db2.query(`
            SELECT e.*, u.username
            FROM Events e
            JOIN users u ON e.userID = u.userID
        `);
    }

    static async getById(id) {
        const result = await db2.query(
            'SELECT * FROM Events WHERE EventID = ?', [id]
        );
        return result[0];
    }
}

const router = express.Router();

router.get("/", async function(req, res) {
    try {
        const rawEvents = await Event.getAll();
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

router.get("/:id", async function(req, res) {
    try {
        const id = req.params.id;
        const event = await Event.getById(id);
        res.render('event-single', { event });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = { Event, router };
