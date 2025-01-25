import db from "../config/db";

// Fetch all aboutTrust items, excluding hidden ones
export const getAllAboutTrustItems = async () => {
    const sql = 'SELECT id, image, description, created_at, updated_at, hide FROM aboutTrust'; // Exclude hidden items
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new aboutTrust item
export const addAboutTrustItem = async (item) => {
    item.image = item.image || 'default-image.png'; // Default image if not provided

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS aboutTrust (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image TEXT NOT NULL,
            description TEXT,
            created_at DATETIME,
            updated_at DATETIME,
            hide BOOLEAN DEFAULT 0
        )
    `;

    await new Promise((resolve, reject) => {
        db.query(createTableSql, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'INSERT INTO aboutTrust (image, description, created_at, updated_at, hide) VALUES (?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.query(sql, [item.image, item.description, now, now, item.hide || 0], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific aboutTrust item by ID
export const getAboutTrustItemById = async (id) => {
    const sql = 'SELECT id, image, description, created_at, updated_at, hide FROM aboutTrust WHERE id = ?';
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

// Update an aboutTrust item by ID
export const updateAboutTrustItem = async (id, updatedItem) => {
    await getAboutTrustItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE aboutTrust SET image = ?, description = ?, updated_at = ?, hide = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.image, updatedItem.description, now, updatedItem.hide, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Soft delete an aboutTrust item by ID (set hide to 1 instead of deleting)
export const deleteAboutTrustItem = async (id) => {
    const sql = 'UPDATE aboutTrust SET hide = 1 WHERE id = ?'; // Soft delete (set hide to 1)
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
