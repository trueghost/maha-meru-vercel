import db from "../config/db";

// Fetch all form items
export const getAllFormItems = async () => {
    const sql = 'SELECT id, name, email, number, interests, description FROM form_handle';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new form item
export const addFormItem = async (item) => {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS form_handle (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255),
            number VARCHAR(100),
            interests TEXT,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;

    await new Promise((resolve, reject) => {
        db.query(createTableSql, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = `
        INSERT INTO form_handle (name, email, number, interests, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [
            item.name, item.email, item.number, JSON.stringify(item.interests), item.description, now, now
        ], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item });
        });
    });
};

// Fetch a specific form item by ID
export const getFormItemById = async (id) => {
    const sql = 'SELECT id, name, email, number, interests, description FROM form_handle WHERE id = ?';
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

// Update a form item by ID
export const updateFormItem = async (id, updatedItem) => {
    await getFormItemById(id); // Ensure the item exists
    const sql = `
        UPDATE form_handle
        SET name = ?, email = ?, number = ?, interests = ?, description = ?, updated_at = ?
        WHERE id = ?
    `;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return new Promise((resolve, reject) => {
        db.query(sql, [
            updatedItem.name, updatedItem.email, updatedItem.number,
            JSON.stringify(updatedItem.interests), updatedItem.description, now, id
        ], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a form item by ID
export const deleteFormItem = async (id) => {
    const sql = 'DELETE FROM form_handle WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
