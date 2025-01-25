import db from "../config/db";

// Fetch all aboutPartnerForm items, excluding hidden ones
export const getAllAboutPartnerFormItems = async () => {
    const sql = 'SELECT id, file, created_at, updated_at, hide FROM aboutPartnerForm'; // Exclude hidden items
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new aboutPartnerForm item
export const addAboutPartnerFormItem = async (item) => {
    item.file = item.file || 'default-file.png'; // Default file if not provided

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS aboutPartnerForm (
            id INT AUTO_INCREMENT PRIMARY KEY,
            file TEXT NOT NULL,
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
    const sql = 'INSERT INTO aboutPartnerForm (file, created_at, updated_at, hide) VALUES (?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.query(sql, [item.file, now, now, item.hide || 0], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific aboutPartnerForm item by ID
export const getAboutPartnerFormItemById = async (id) => {
    const sql = 'SELECT id, file, created_at, updated_at, hide FROM aboutPartnerForm WHERE id = ?';
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

// Update an aboutPartnerForm item by ID
export const updateAboutPartnerFormItem = async (id, updatedItem) => {
    await getAboutPartnerFormItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE aboutPartnerForm SET file = ?, updated_at = ?, hide = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.file, now, updatedItem.hide, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Soft delete an aboutPartnerForm item by ID (set hide to 1 instead of deleting)
export const deleteAboutPartnerFormItem = async (id) => {
    const sql = 'UPDATE aboutPartnerForm SET hide = 1 WHERE id = ?'; // Soft delete (set hide to 1)
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};