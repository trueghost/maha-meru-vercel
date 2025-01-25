import db from "../config/db";

// Fetch all agriculture items
export const getAllAgricultureItems = async () => {
    const sql = 'SELECT id, title, description, plantImage, plantSmallImage, section, created_at, updated_at FROM agriculture';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new agriculture item
export const addAgricultureItem = async (item) => {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS agriculture (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            plantImage TEXT,
            plantSmallImage TEXT,
            section TEXT NOT NULL,
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
    const sql = 'INSERT INTO agriculture (title, description, plantImage, plantSmallImage, section, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.query(sql, [item.title, item.description, item.plantImage, item.plantSmallImage, item.section, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific agriculture item by ID
export const getAgricultureItemById = async (id) => {
    const sql = 'SELECT id, title, description, plantImage, plantSmallImage, section, created_at, updated_at FROM agriculture WHERE id = ?';
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

// Update an agriculture item by ID
export const updateAgricultureItem = async (id, updatedItem) => {
    await getAgricultureItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE agriculture SET title = ?, description = ?, plantImage = ?, plantSmallImage = ?, section = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.title, updatedItem.description, updatedItem.plantImage, updatedItem.plantSmallImage, updatedItem.section, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete an agriculture item by ID
export const deleteAgricultureItem = async (id) => {
    const sql = 'DELETE FROM agriculture WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
