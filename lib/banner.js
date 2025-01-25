import db from "../config/db";

// Fetch all banner items
export const getAllBannerItems = async () => {
    const sql = 'SELECT id, image, title, description, created_at, updated_at FROM banner';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new banner item
export const addBannerItem = async (item) => {
    item.image = item.image || 'default-image.png'; // Default image if not provided

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS banner (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image TEXT NOT NULL,
            title TEXT,
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
    const sql = 'INSERT INTO banner (image, title, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [item.image, item.title, item.description, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific banner item by ID
export const getBannerItemById = async (id) => {
    const sql = 'SELECT id, image, title, description, created_at, updated_at FROM banner WHERE id = ?';
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

// Update a banner item by ID
export const updateBannerItem = async (id, updatedItem) => {
    await getBannerItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE banner SET image = ?, title = ?, description = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.image, updatedItem.title, updatedItem.description, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a banner item by ID
export const deleteBannerItem = async (id) => {
    const sql = 'DELETE FROM banner WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
