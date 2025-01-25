import db from "../config/db";

// Fetch all connectSecond items
export const getAllConnectSecondItems = async () => {
    const sql = 'SELECT id, image, title, description, created_at, updated_at FROM connectSecond';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new connectSecond item
export const addConnectSecondItem = async (item) => {
    item.image = item.image || 'default-image.png'; // Default image if not provided

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS connectSecond (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image TEXT NOT NULL,
            title TEXT NOT NULL,
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
    const sql = 'INSERT INTO connectSecond (image, title, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [item.image, item.title, item.description, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific connectSecond item by ID
export const getConnectSecondItemById = async (id) => {
    const sql = 'SELECT id, image, title, description, created_at, updated_at FROM connectSecond WHERE id = ?';
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

// Update a connectSecond item by ID
export const updateConnectSecondItem = async (id, updatedItem) => {
    await getConnectSecondItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE connectSecond SET image = ?, title = ?, description = ?, updated_at = ? WHERE id = ?'; // Include title in the update
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.image, updatedItem.title, updatedItem.description, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a connectSecond item by ID
export const deleteConnectSecondItem = async (id) => {
    const sql = 'DELETE FROM connectSecond WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
