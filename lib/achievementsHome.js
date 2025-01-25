import db from "../config/db";

// Fetch all achievements
export const getAllAchievements = async () => {
    const sql = 'SELECT id, image, hide, created_at, updated_at FROM Achievements';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new achievement (includes `hide` column)
export const addAchievement = async (achievement) => {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS Achievements (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image TEXT NOT NULL,
            hide BOOLEAN NOT NULL DEFAULT 0,
            created_at DATETIME,
            updated_at DATETIME
        )
    `;

    await new Promise((resolve, reject) => {
        db.query(createTableSql, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'INSERT INTO Achievements (image, hide, created_at, updated_at) VALUES (?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [achievement.image, achievement.hide ?? false, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, image: achievement.image, hide: achievement.hide ?? false, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific achievement by ID
export const getAchievementById = async (id) => {
    const sql = 'SELECT id, image, hide, created_at, updated_at FROM Achievements WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) {
                return reject(new Error('Achievement not found'));
            }
            resolve(rows[0]);
        });
    });
};

// Update an achievement by ID (includes `hide` column)
export const updateAchievement = async (id, updatedAchievement) => {
    await getAchievementById(id); // Ensure the achievement exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE Achievements SET image = ?, hide = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedAchievement.image, updatedAchievement.hide ?? false, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete an achievement by ID
export const deleteAchievement = async (id) => {
    const sql = 'DELETE FROM Achievements WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};