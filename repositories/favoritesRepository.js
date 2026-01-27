const db = require("../config/db");

class FavoritesRepository {
    getByUserId(userId) { //returns only that user's favorites
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM Favorites WHERE userId = ? ORDER BY createdAt DESC`,
                [userId],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                }
            );
        });
    }

    addFavorite({ userId, videoId, title, thumbnailUrl, videoUrl }) { //inserts a favorite tied to userId
        return new Promise((resolve, reject) => {
            db.run(
                `
                INSERT INTO Favorites (userId, videoId, title, thumbnailUrl, videoUrl, createdAt)
                VALUES (?, ?, ?, ?, ?, datetime('now'))
                `,
                [userId, videoId, title, thumbnailUrl, videoUrl],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    deleteFavorite(favoriteId, userId) { //prevents deleting another user's data
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE FROM Favorites WHERE id = ? AND userId = ?`,
                [favoriteId, userId],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes); // 1 if deleted, 0 if not
                }
            );
        });
    }
}

module.exports = new FavoritesRepository();
