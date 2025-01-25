import db from "../config/db";

// Fetch all aboutStory items
export const getAllAboutStoryItems = async () => {
    const sql = 'SELECT id, image, description, created_at, updated_at FROM aboutStory';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new aboutStory item
export const addAboutStoryItem = async (item) => {
    item.image = item.image || 'default-image.png'; // Default image if not provided

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS aboutStory (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image TEXT NOT NULL,
            description TEXT,
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
    const sql = 'INSERT INTO aboutStory (image, description, created_at, updated_at) VALUES (?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [item.image, item.description, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific aboutStory item by ID
export const getAboutStoryItemById = async (id) => {
    const sql = 'SELECT id, image, description, created_at, updated_at FROM aboutStory WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) {
                return reject(new Error('Item not found'));
            }
            resolve(rows[0]);
        });
    });
};

// Update an aboutStory item by ID
export const updateAboutStoryItem = async (id, updatedItem) => {
    await getAboutStoryItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE aboutStory SET image = ?, description = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.image, updatedItem.description, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete an aboutStory item by ID
export const deleteAboutStoryItem = async (id) => {
    const sql = 'DELETE FROM aboutStory WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
