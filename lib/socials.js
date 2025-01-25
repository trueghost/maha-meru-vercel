import db from "../config/db";

// Fetch all connect social items, excluding hidden ones
export const getAllConnectSocialItems = async () => {
    const sql = 'SELECT id, category, title, description, image_url, date, link, hide FROM connect_social_items'; // Filter out hidden items
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new connect social item
export const addConnectSocialItem = async (item) => {
    item.image_url = item.image_url || 'default-image.png';
    item.link = item.link || ''; // Set a default empty string if link is not provided
    item.hide = item.hide || 0; // Default hide to 0 (visible)

    // Create the table if it doesn't exist
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS connect_social_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            date DATETIME,
            link TEXT,
            hide BOOLEAN DEFAULT 0
        )
    `;

    await new Promise((resolve, reject) => {
        db.query(createTableSql, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    // Convert the frontend date to 'YYYY-MM-DD HH:MM:SS' format
    const dateFromFrontend = new Date(item.date);
    const formattedDate = dateFromFrontend.toISOString().slice(0, 19).replace('T', ' ');

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'INSERT INTO connect_social_items (category, title, description, image_url, date, link, hide, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.query(sql, [item.category, item.title, item.description, item.image_url, formattedDate, item.link, item.hide, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, date: formattedDate });
        });
    });
};

// Fetch a specific connect social item by ID
export const getConnectSocialItemById = async (id) => {
    const sql = 'SELECT id, category, title, description, image_url, date, link, hide FROM connect_social_items WHERE id = ?'; // Added hide column
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

// Update a connect social item by ID, including the hide field
export const updateConnectSocialItem = async (id, updatedItem) => {
    await getConnectSocialItemById(id); // Ensure the item exists
    const sql = 'UPDATE connect_social_items SET category = ?, title = ?, description = ?, image_url = ?, link = ?, hide = ?, updated_at = ?, date = ? WHERE id = ?';
    const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current date/time
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.category, updatedItem.title, updatedItem.description, updatedItem.image_url, updatedItem.link, updatedItem.hide, now, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Hard delete a connect social item by ID (remove the item completely)
export const deleteConnectSocialItem = async (id) => {
    const sql = 'DELETE FROM connect_social_items WHERE id = ?'; // Hard delete (remove the item completely)
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
