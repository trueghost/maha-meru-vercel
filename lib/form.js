import db from "../config/db";

// Fetch all form items
export const getAllFormItems = async () => {
    const sql = 'SELECT id, mobile_number_1, mobile_number_2, mail, location, facebook_url, x_url, instagram_url, linkedin_url, whatsapp_url, placeholder_1, placeholder_2, placeholder_3, placeholder_4, placeholder_5, placeholder_6, placeholder_7, placeholder_8, placeholder_9 FROM form_items';
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
        CREATE TABLE IF NOT EXISTS form_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            mobile_number_1 VARCHAR(15),
            mobile_number_2 VARCHAR(15),
            mail VARCHAR(255),
            location VARCHAR(255),
            facebook_url TEXT,
            x_url TEXT,
            instagram_url TEXT,
            linkedin_url TEXT,
            whatsapp_url TEXT,
            placeholder_1 VARCHAR(255),
            placeholder_2 VARCHAR(255),
            placeholder_3 VARCHAR(255),
            placeholder_4 VARCHAR(255),
            placeholder_5 VARCHAR(255),
            placeholder_6 VARCHAR(255),
            placeholder_7 VARCHAR(255),
            placeholder_8 VARCHAR(255),
            placeholder_9 VARCHAR(255),
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
        INSERT INTO form_items (mobile_number_1, mobile_number_2, mail, location, facebook_url, x_url, instagram_url, linkedin_url, whatsapp_url, placeholder_1, placeholder_2, placeholder_3, placeholder_4, placeholder_5, placeholder_6, placeholder_7, placeholder_8, placeholder_9, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [
            item.mobile_number_1, item.mobile_number_2, item.mail, item.location,
            item.facebook_url, item.x_url, item.instagram_url, item.linkedin_url, 
            item.whatsapp_url, item.placeholder_1, item.placeholder_2, item.placeholder_3, 
            item.placeholder_4, item.placeholder_5, item.placeholder_6, item.placeholder_7, 
            item.placeholder_8, item.placeholder_9, now, now
        ], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item });
        });
    });
};

// Fetch a specific form item by ID
export const getFormItemById = async (id) => {
    const sql = 'SELECT id, mobile_number_1, mobile_number_2, mail, location, facebook_url, x_url, instagram_url, linkedin_url, whatsapp_url, placeholder_1, placeholder_2, placeholder_3, placeholder_4, placeholder_5, placeholder_6, placeholder_7, placeholder_8, placeholder_9 FROM form_items WHERE id = ?';
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
        UPDATE form_items 
        SET mobile_number_1 = ?, mobile_number_2 = ?, mail = ?, location = ?, facebook_url = ?, x_url = ?, instagram_url = ?, linkedin_url = ?, whatsapp_url = ?, placeholder_1 = ?, placeholder_2 = ?, placeholder_3 = ?, placeholder_4 = ?, placeholder_5 = ?, placeholder_6 = ?, placeholder_7 = ?, placeholder_8 = ?, placeholder_9 = ?, updated_at = ?
        WHERE id = ?
    `;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return new Promise((resolve, reject) => {
        db.query(sql, [
            updatedItem.mobile_number_1, updatedItem.mobile_number_2, updatedItem.mail, 
            updatedItem.location, updatedItem.facebook_url, updatedItem.x_url, 
            updatedItem.instagram_url, updatedItem.linkedin_url, updatedItem.whatsapp_url, 
            updatedItem.placeholder_1, updatedItem.placeholder_2, updatedItem.placeholder_3, 
            updatedItem.placeholder_4, updatedItem.placeholder_5, updatedItem.placeholder_6, 
            updatedItem.placeholder_7, updatedItem.placeholder_8, updatedItem.placeholder_9, now, id
        ], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a form item by ID
export const deleteFormItem = async (id) => {
    const sql = 'DELETE FROM form_items WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};