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

module.exports = { Event };