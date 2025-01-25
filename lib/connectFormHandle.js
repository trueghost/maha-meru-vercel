import db from "../config/db";

// Fetch all connect form items
export const getAllConnectFormItems = async () => {
    const sql = 'SELECT id, name, email FROM connect_form_handle';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new connect form item
export const addConnectFormItem = async (item) => {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS connect_form_handle (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255),
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
        INSERT INTO connect_form_handle (name, email, created_at, updated_at)
        VALUES (?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [item.name, item.email, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item });
        });
    });
};

// Fetch a specific connect form item by ID
export const getConnectFormItemById = async (id) => {
    const sql = 'SELECT id, name, email FROM connect_form_handle WHERE id = ?';
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

// Update a connect form item by ID
export const updateConnectFormItem = async (id, updatedItem) => {
    await getConnectFormItemById(id); // Ensure the item exists
    const sql = `
        UPDATE connect_form_handle
        SET name = ?, email = ?, updated_at = ?
        WHERE id = ?
    `;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.name, updatedItem.email, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a connect form item by ID
export const deleteConnectFormItem = async (id) => {
    const sql = 'DELETE FROM connect_form_handle WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
