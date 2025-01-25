import db from "../config/db";

// Fetch all agriculture items
export const getAllAgricultureItems = async () => {
    const sql = 'SELECT id, category, title, description, image_url, is_mobile_image, link, created_at, updated_at FROM agriculture_items';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new agriculture item
export const addAgricultureItem = async (item) => {
    item.image_url = item.image_url || 'default-image.png';
    item.is_mobile_image = item.is_mobile_image || false; // Default value
    item.link = item.link || ''; // Default empty string if no link is provided

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS agriculture_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            image_url TEXT,
            is_mobile_image BOOLEAN DEFAULT FALSE,
            link TEXT,
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
    const sql = 'INSERT INTO agriculture_items (category, title, description, image_url, is_mobile_image, link, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [item.category, item.title, item.description, item.image_url, item.is_mobile_image, item.link, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific agriculture item by ID
export const getAgricultureItemById = async (id) => {
    const sql = 'SELECT id, category, title, description, image_url, is_mobile_image, link, created_at, updated_at FROM agriculture_items WHERE id = ?';
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

// Update an agriculture item by ID
export const updateAgricultureItem = async (id, updatedItem) => {
    await getAgricultureItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE agriculture_items SET category = ?, title = ?, description = ?, image_url = ?, is_mobile_image = ?, link = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.category, updatedItem.title, updatedItem.description, updatedItem.image_url, updatedItem.is_mobile_image, updatedItem.link, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete an agriculture item by ID
export const deleteAgricultureItem = async (id) => {
    const sql = 'DELETE FROM agriculture_items WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};