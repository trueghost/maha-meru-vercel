import db from "../config/db";

// Fetch all animal items
export const getAllAnimalItems = async () => {
    const sql = 'SELECT id, title, description, animalImage, animalSmallImage, section, created_at, updated_at FROM animal';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new animal item
export const addAnimalItem = async (item) => {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS animal (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            animalImage TEXT,
            animalSmallImage TEXT,
            section TEXT NOT NULL,
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
    const sql = 'INSERT INTO animal (title, description, animalImage, animalSmallImage, section, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.query(sql, [item.title, item.description, item.animalImage, item.animalSmallImage, item.section, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific animal item by ID
export const getAnimalItemById = async (id) => {
    const sql = 'SELECT id, title, description, animalImage, animalSmallImage, section, created_at, updated_at FROM animal WHERE id = ?';
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

// Update an animal item by ID
export const updateAnimalItem = async (id, updatedItem) => {
    await getAnimalItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE animal SET title = ?, description = ?, animalImage = ?, animalSmallImage = ?, section = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.title, updatedItem.description, updatedItem.animalImage, updatedItem.animalSmallImage, updatedItem.section, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete an animal item by ID
export const deleteAnimalItem = async (id) => {
    const sql = 'DELETE FROM animal WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
