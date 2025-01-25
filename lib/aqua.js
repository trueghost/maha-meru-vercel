import db from "../config/db";

// Fetch all aqua items
export const getAllAquaItems = async () => {
    const sql = 'SELECT id, title, description, plantImage, plantSmallImage, section, created_at, updated_at FROM aqua';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new aqua item
export const addAquaItem = async (item) => {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS aqua (
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
    const sql = 'INSERT INTO aqua (title, description, plantImage, plantSmallImage, section, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.query(sql, [item.title, item.description, item.plantImage, item.plantSmallImage, item.section, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific aqua item by ID
export const getAquaItemById = async (id) => {
    const sql = 'SELECT id, title, description, plantImage, plantSmallImage, section, created_at, updated_at FROM aqua WHERE id = ?';
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

// Update an aqua item by ID
export const updateAquaItem = async (id, updatedItem) => {
    await getAquaItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE aqua SET title = ?, description = ?, plantImage = ?, plantSmallImage = ?, section = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.title, updatedItem.description, updatedItem.plantImage, updatedItem.plantSmallImage, updatedItem.section, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete an aqua item by ID
export const deleteAquaItem = async (id) => {
    const sql = 'DELETE FROM aqua WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
