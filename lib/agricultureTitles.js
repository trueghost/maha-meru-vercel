import db from "../config/db";

// Fetch all agricultureTitles items
export const getAllAgricultureTitlesItems = async () => {
    const sql = 'SELECT id, title, created_at, updated_at FROM agricultureTitles';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new agricultureTitles item
export const addAgricultureTitlesItem = async (item) => {
    item.title = item.title || 'Default Title'; // Default title if not provided

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS agricultureTitles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title TEXT NOT NULL,
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
    const sql = 'INSERT INTO agricultureTitles (title, created_at, updated_at) VALUES (?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [item.title, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific agricultureTitles item by ID
export const getAgricultureTitlesItemById = async (id) => {
    const sql = 'SELECT id, title, created_at, updated_at FROM agricultureTitles WHERE id = ?';
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

// Update an agricultureTitles item by ID
export const updateAgricultureTitlesItem = async (id, updatedItem) => {
    await getAgricultureTitlesItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE agricultureTitles SET title = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.title, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete an agricultureTitles item by ID
export const deleteAgricultureTitlesItem = async (id) => {
    const sql = 'DELETE FROM agricultureTitles WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
