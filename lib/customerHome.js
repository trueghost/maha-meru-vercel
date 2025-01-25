import db from "../config/db";

// Fetch all customer stories, excluding hidden ones
export const getAllCustomerStories = async () => {
    const sql = 'SELECT id, image, review, name, role, created_at, updated_at, hide FROM CustomerStories'; // Exclude hidden stories
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new customer story
export const addCustomerStory = async (story) => {

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS CustomerStories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            image TEXT NOT NULL,
            review TEXT NOT NULL,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(255),
            created_at DATETIME,
            updated_at DATETIME,
            hide BOOLEAN DEFAULT 0
        )
    `;

    await new Promise((resolve, reject) => {
        db.query(createTableSql, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'INSERT INTO CustomerStories (image, review, name, role, created_at, updated_at, hide) VALUES (?, ?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.query(sql, [story.image, story.review, story.name, story.role, now, now, story.hide || 0], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...story, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific customer story by ID
export const getCustomerStoryById = async (id) => {
    const sql = 'SELECT id, image, review, name, role, created_at, updated_at, hide FROM CustomerStories WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) {
                return reject(new Error('Customer story not found'));
            }
            resolve(rows[0]);
        });
    });
};

// Update a customer story by ID
export const updateCustomerStory = async (id, updatedStory) => {
    await getCustomerStoryById(id); // Ensure the story exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE CustomerStories SET image = ?, review = ?, name = ?, role = ?, updated_at = ?, hide = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedStory.image, updatedStory.review, updatedStory.name, updatedStory.role, now, updatedStory.hide, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Soft delete a customer story by ID (set hide to 1 instead of deleting)
export const deleteCustomerStory = async (id) => {
    const sql = 'UPDATE CustomerStories SET hide = 1 WHERE id = ?'; // Soft delete (set hide to 1)
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
