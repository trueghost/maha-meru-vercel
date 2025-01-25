import db from "../config/db";

// Fetch all aboutFirst items
export const getAllAboutFirstItems = async () => {
    const sql = 'SELECT id, image, description, created_at, updated_at FROM aboutFirst';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new aboutFirst item
export const addAboutFirstItem = async (item) => {
    item.image = item.image || 'default-image.png'; // Default image if not provided

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS aboutFirst (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image TEXT NOT NULL,
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
    const sql = 'INSERT INTO aboutFirst (image, description, created_at, updated_at) VALUES (?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [item.image, item.description, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific aboutFirst item by ID
export const getAboutFirstItemById = async (id) => {
    const sql = 'SELECT id, image, description, created_at, updated_at FROM aboutFirst WHERE id = ?';
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

// Update an aboutFirst item by ID
export const updateAboutFirstItem = async (id, updatedItem) => {
    await getAboutFirstItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE aboutFirst SET image = ?, description = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.image, updatedItem.description, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete an aboutFirst item by ID
export const deleteAboutFirstItem = async (id) => {
    const sql = 'DELETE FROM aboutFirst WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
