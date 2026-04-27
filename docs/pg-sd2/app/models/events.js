const express = require('express');
const db2 = require('../services/db2');

class Event {

    static async getAll() {
        return await db2.query(`
            SELECT e.*, u.username, COUNT(er.id) AS participant_count
            FROM Events e
            JOIN users u ON e.userID = u.userID
            LEFT JOIN event_registrations er ON er.EventID = e.EventID
            GROUP BY e.EventID, u.username
        `);
    }

    static async getById(id) {
        const result = await db2.query(
            'SELECT e.*, u.username FROM Events e JOIN users u ON e.userID = u.userID WHERE e.EventID = ?', [id]
        );
        return result[0];
    }
}

const router = express.Router();

router.get("/", async function(_req, res) {
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
            max_participants:  e.max_participants  || 20,
        }));

        const featured = events[0] || null;
        const rest = featured ? events.slice(1) : events;

        let games = [];
        try { games = await db2.query('SELECT id, name, slug FROM games ORDER BY name'); } catch(e) {}

        res.render('events', { featured, events: rest, games });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/:id", async function(req, res) {
    try {
        const id = req.params.id;
        const event = await Event.getById(id);
        if (!event) return res.status(404).send('Event not found');

        let isRegistered = false;
        let registrationCount = 0;
        try {
            const countRow = await db2.query(
                'SELECT COUNT(*) AS c FROM event_registrations WHERE EventID = ?', [id]
            );
            registrationCount = countRow[0]?.c || 0;

            if (req.session.userId) {
                const reg = await db2.query(
                    'SELECT id FROM event_registrations WHERE EventID = ? AND userID = ?',
                    [id, req.session.userId]
                );
                isRegistered = reg.length > 0;
            }
        } catch(e) {}

        const justJoined = req.query.joined === '1';
        const isFull = req.query.full === '1';
        res.render('event-single', { event, isRegistered, justJoined, isFull, registrationCount });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/:id/join", async function(req, res) {
    const id = req.params.id;

    if (!req.session.userId) {
        return res.redirect('/login?redirect=/events/' + id);
    }

    try {
        const event = await Event.getById(id);
        if (!event) return res.status(404).send('Event not found');

        const countRow = await db2.query(
            'SELECT COUNT(*) AS c FROM event_registrations WHERE EventID = ?', [id]
        );
        const taken = countRow[0]?.c || 0;
        const maxSlots = event.max_participants || 20;
        if (taken >= maxSlots) {
            return res.redirect('/events/' + id + '?full=1');
        }

        await db2.query(
            'INSERT IGNORE INTO event_registrations (EventID, userID) VALUES (?, ?)',
            [id, req.session.userId]
        );

        res.redirect('/events/' + id + '?joined=1');
    } catch (err) {
        console.error('Join error:', err);
        res.status(500).send('Failed to join event');
    }
});

router.post("/:id/quit", async function(req, res) {
    const id = req.params.id;

    if (!req.session.userId) {
        return res.redirect('/login?redirect=/events/' + id);
    }

    try {
        await db2.query(
            'DELETE FROM event_registrations WHERE EventID = ? AND userID = ?',
            [id, req.session.userId]
        );
        res.redirect('/events/' + id);
    } catch (err) {
        console.error('Quit error:', err);
        res.status(500).send('Failed to quit event');
    }
});

module.exports = { Event, router };
