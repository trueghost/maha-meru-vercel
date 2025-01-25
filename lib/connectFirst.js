import db from "../config/db";

// Fetch all connectFirst items
export const getAllConnectFirstItems = async () => {
    const sql = 'SELECT id, image, description, created_at, updated_at FROM connectFirst';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new connectFirst item
export const addConnectFirstItem = async (item) => {
    item.image = item.image || 'default-image.png'; // Default image if not provided

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS connectFirst (
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
    const sql = 'INSERT INTO connectFirst (image, description, created_at, updated_at) VALUES (?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [item.image, item.description, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific connectFirst item by ID
export const getConnectFirstItemById = async (id) => {
    const sql = 'SELECT id, image, description, created_at, updated_at FROM connectFirst WHERE id = ?';
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

// Update a connectFirst item by ID
export const updateConnectFirstItem = async (id, updatedItem) => {
    await getConnectFirstItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE connectFirst SET image = ?, description = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.image, updatedItem.description, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a connectFirst item by ID
export const deleteConnectFirstItem = async (id) => {
    const sql = 'DELETE FROM connectFirst WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
