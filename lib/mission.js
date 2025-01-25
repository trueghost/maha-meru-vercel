import db from "../config/db";

// Fetch all mission items
export const getAllMissionItems = async () => {
    const sql = 'SELECT id, smallImage1, smallImage2, smallImage3, smallImage4, image1, image2, image3, image4, image5, imageTitle1, imageTitle2, imageTitle3, imageTitle4, imageTitle5, pioneerTitle, pioneerSubtitle, created_at, updated_at FROM mission';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new mission item
export const addMissionItem = async (item) => {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS mission (
            id INT AUTO_INCREMENT PRIMARY KEY,
            smallImage1 TEXT,
            smallImage2 TEXT,
            smallImage3 TEXT,
            smallImage4 TEXT,
            image1 TEXT,
            image2 TEXT,
            image3 TEXT,
            image4 TEXT,
            image5 TEXT,
            imageTitle1 TEXT,
            imageTitle2 TEXT,
            imageTitle3 TEXT,
            imageTitle4 TEXT,
            imageTitle5 TEXT,
            pioneerTitle TEXT,
            pioneerSubtitle TEXT,
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
    const sql = 'INSERT INTO mission (smallImage1, smallImage2, smallImage3, smallImage4, image1, image2, image3, image4, image5, imageTitle1, imageTitle2, imageTitle3, imageTitle4, imageTitle5, pioneerTitle, pioneerSubtitle, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.query(sql, [
            item.smallImage1, item.smallImage2, item.smallImage3, item.smallImage4,
            item.image1, item.image2, item.image3, item.image4, item.image5,
            item.imageTitle1, item.imageTitle2, item.imageTitle3, item.imageTitle4,
            item.imageTitle5, item.pioneerTitle, item.pioneerSubtitle, now, now
        ], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...item, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific mission item by ID
export const getMissionItemById = async (id) => {
    const sql = 'SELECT id, smallImage1, smallImage2, smallImage3, smallImage4, image1, image2, image3, image4, image5, imageTitle1, imageTitle2, imageTitle3, imageTitle4, imageTitle5, pioneerTitle, pioneerSubtitle, created_at, updated_at FROM mission WHERE id = ?';
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

// Update a mission item by ID
export const updateMissionItem = async (id, updatedItem) => {
    await getMissionItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE mission SET smallImage1 = ?, smallImage2 = ?, smallImage3 = ?, smallImage4 = ?, image1 = ?, image2 = ?, image3 = ?, image4 = ?, image5 = ?, imageTitle1 = ?, imageTitle2 = ?, imageTitle3 = ?, imageTitle4 = ?, imageTitle5 = ?, pioneerTitle = ?, pioneerSubtitle = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [
            updatedItem.smallImage1, updatedItem.smallImage2, updatedItem.smallImage3, updatedItem.smallImage4,
            updatedItem.image1, updatedItem.image2, updatedItem.image3, updatedItem.image4, updatedItem.image5,
            updatedItem.imageTitle1, updatedItem.imageTitle2, updatedItem.imageTitle3, updatedItem.imageTitle4,
            updatedItem.imageTitle5, updatedItem.pioneerTitle, updatedItem.pioneerSubtitle, now, id
        ], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a mission item by ID
export const deleteMissionItem = async (id) => {
    const sql = 'DELETE FROM mission WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
