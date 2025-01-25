import db from "../config/db";

// Fetch all product form items
export const getAllProductFormItems = async () => {
    const sql = 'SELECT id, name, email FROM product_form_handle';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new product form item
export const addProductFormItem = async (item) => {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS product_form_handle (
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
        INSERT INTO product_form_handle (name, email, created_at, updated_at)
        VALUES (?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [item.name, item.email, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item });
        });
    });
};

// Fetch a specific product form item by ID
export const getProductFormItemById = async (id) => {
    const sql = 'SELECT id, name, email FROM product_form_handle WHERE id = ?';
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

// Update a product form item by ID
export const updateProductFormItem = async (id, updatedItem) => {
    await getProductFormItemById(id); // Ensure the item exists
    const sql = `
        UPDATE product_form_handle
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

// Delete a product form item by ID
export const deleteProductFormItem = async (id) => {
    const sql = 'DELETE FROM product_form_handle WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
