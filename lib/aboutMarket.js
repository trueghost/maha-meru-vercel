import db from "../config/db";

// Fetch all aboutMarketItems
export const getAllAboutMarketItems = async () => {
    const sql = 'SELECT id, image, title, hoverImage, created_at, updated_at FROM aboutMarketItems';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new aboutMarketItem
export const addAboutMarketItem = async (item) => {
    item.image = item.image || 'default-image.png'; // Default image if not provided
    item.hoverImage = item.hoverImage || 'default-hover-image.png'; // Default hover image if not provided

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS aboutMarketItems (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image TEXT NOT NULL,
            title TEXT,
            hoverImage TEXT, 
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
    const sql = 'INSERT INTO aboutMarketItems (image, title, hoverImage, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.query(sql, [item.image, item.title, item.hoverImage, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific aboutMarketItem by ID
export const getAboutMarketItemById = async (id) => {
    const sql = 'SELECT id, image, title, hoverImage, created_at, updated_at FROM aboutMarketItems WHERE id = ?';
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

// Update an aboutMarketItem by ID
export const updateAboutMarketItem = async (id, updatedItem) => {
    await getAboutMarketItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE aboutMarketItems SET image = ?, title = ?, hoverImage = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.image, updatedItem.title, updatedItem.hoverImage, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete an aboutMarketItem by ID
export const deleteAboutMarketItem = async (id) => {
    const sql = 'DELETE FROM aboutMarketItems WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
