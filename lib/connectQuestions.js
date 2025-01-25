import db from "../config/db";

// Fetch all connectQuestions items
export const getAllConnectQuestionsItems = async () => {
    const sql = 'SELECT id, title, description, created_at, updated_at FROM connectQuestions';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new connectQuestions item
export const addConnectQuestionsItem = async (item) => {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS connectQuestions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title TEXT NOT NULL,
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
    const sql = 'INSERT INTO connectQuestions (title, description, created_at, updated_at) VALUES (?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [item.title, item.description, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific connectQuestions item by ID
export const getConnectQuestionsItemById = async (id) => {
    const sql = 'SELECT id, title, description, created_at, updated_at FROM connectQuestions WHERE id = ?';
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

// Update a connectQuestions item by ID
export const updateConnectQuestionsItem = async (id, updatedItem) => {
    await getConnectQuestionsItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE connectQuestions SET title = ?, description = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.title, updatedItem.description, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a connectQuestions item by ID
export const deleteConnectQuestionsItem = async (id) => {
    const sql = 'DELETE FROM connectQuestions WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
