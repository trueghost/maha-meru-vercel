import db from "../config/db";

// Fetch all productSupply items
export const getAllProductSupplyItems = async () => {
    const sql = 'SELECT id, title, created_at, updated_at FROM productSupply';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new productSupply item
export const addProductSupplyItem = async (item) => {
    item.title = item.title || 'Default Title'; // Default title if not provided

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS productSupply (
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
    const sql = 'INSERT INTO productSupply (title, created_at, updated_at) VALUES (?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [item.title, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific productSupply item by ID
export const getProductSupplyItemById = async (id) => {
    const sql = 'SELECT id, title, created_at, updated_at FROM productSupply WHERE id = ?';
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

// Update a productSupply item by ID
export const updateProductSupplyItem = async (id, updatedItem) => {
    await getProductSupplyItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE productSupply SET title = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.title, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a productSupply item by ID
export const deleteProductSupplyItem = async (id) => {
    const sql = 'DELETE FROM productSupply WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
