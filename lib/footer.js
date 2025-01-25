import db from "../config/db";

// Fetch all footer items
export const getAllFooterItems = async () => {
    const sql = 'SELECT id, image, image_title, explore_title, contact_title, location, number, mail, facebook_link, whatsapp_link, twitter_link, insta_link, created_at, updated_at FROM footer';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new footer item
export const addFooterItem = async (item) => {
    item.image = item.image || 'default-image.png'; // Default image if not provided

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS footer (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image TEXT NOT NULL,
            image_title TEXT,
            explore_title TEXT,
            contact_title TEXT,
            location TEXT,
            number TEXT,
            mail TEXT,
            facebook_link TEXT,
            whatsapp_link TEXT,
            twitter_link TEXT,
            insta_link TEXT,
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
    const sql = 'INSERT INTO footer (image, image_title, explore_title, contact_title, location, number, mail, facebook_link, whatsapp_link, twitter_link, insta_link, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [item.image, item.image_title, item.explore_title, item.contact_title, item.location, item.number, item.mail, item.facebook_link, item.whatsapp_link, item.twitter_link, item.insta_link, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific footer item by ID
export const getFooterItemById = async (id) => {
    const sql = 'SELECT id, image, image_title, explore_title, contact_title, location, number, mail, facebook_link, whatsapp_link, twitter_link, insta_link, created_at, updated_at FROM footer WHERE id = ?';
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

// Update a footer item by ID
export const updateFooterItem = async (id, updatedItem) => {
    await getFooterItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE footer SET image = ?, image_title = ?, explore_title = ?, contact_title = ?, location = ?, number = ?, mail = ?, facebook_link = ?, whatsapp_link = ?, twitter_link = ?, insta_link = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.image, updatedItem.image_title, updatedItem.explore_title, updatedItem.contact_title, updatedItem.location, updatedItem.number, updatedItem.mail, updatedItem.facebook_link, updatedItem.whatsapp_link, updatedItem.twitter_link, updatedItem.insta_link, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a footer item by ID
export const deleteFooterItem = async (id) => {
    const sql = 'DELETE FROM footer WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
