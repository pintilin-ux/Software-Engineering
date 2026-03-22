// Get the functions in the db.js file to use
const db = require('./../services/db');

class Guide {
    // Guide ID
    id;
    // User ID of author
    userID;
    // Guide title
    title;
    // Guide content
    content;
    // Guide genre
    genre;
    // Guide skill level
    skillLevel;
    // Date created
    createdAt;

    constructor(id) {
        this.id = id;
    }

    // Get one guide's details from the database
    async getGuideDetails() {
        var sql = "SELECT * FROM guides WHERE GID = ?";
        const results = await db.query(sql, [this.id]);
        this.userID = results[0].userID;
        this.title = results[0].title;
        this.content = results[0].content;
        this.genre = results[0].Genre;
        this.skillLevel = results[0].Skill_level;
        this.createdAt = results[0].created_at;
    }

    // Short version of the content for cards
    getShortContent() {
        if (!this.content) {
            return "";
        }
        if (this.content.length > 100) {
            return this.content.substring(0, 100) + "...";
        }
        return this.content;
    }

    // Get all guides from database
    static async getAllGuides() {
        var sql = "SELECT * FROM guides";
        const results = await db.query(sql);
        var guides = [];
        for (var row of results) {
            var guide = new Guide(row.GID);
            guide.userID = row.userID;
            guide.title = row.title;
            guide.content = row.content;
            guide.genre = row.Genre;
            guide.skillLevel = row.Skill_level;
            guide.createdAt = row.created_at;

            guides.push(guide);
        }
        return guides;
    }
}

module.exports = {
    Guide
}