import db from "../config/db";

// Fetch all tabs items
export const getAllTabsItems = async () => {
    const sql = 'SELECT id, productIds, tabTitle, created_at, updated_at FROM tabs';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new tabs item
export const addTabsItem = async (item) => {
    item.tabTitle = item.tabTitle || 'Default Title'; // Default title if not provided

    // Create the table if it doesn't exist (adding id as primary key)
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS tabs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            productIds JSON NOT NULL,
            tabTitle TEXT NOT NULL,
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
    const sql = 'INSERT INTO tabs (productIds, tabTitle, created_at, updated_at) VALUES (?, ?, ?, ?)';

    // Assuming productIds is passed as an array of IDs
    const productIdsJson = JSON.stringify(item.productIds);

    return new Promise((resolve, reject) => {
        db.query(sql, [productIdsJson, item.tabTitle, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({
                id: result.insertId,  // Return the auto-generated ID
                productIds: productIdsJson, 
                tabTitle: item.tabTitle, 
                created_at: now, 
                updated_at: now
            });
        });
    });
};

// Fetch a specific tabs item by ID
export const getTabsItemById = async (id) => {
    const sql = 'SELECT id, productIds, tabTitle, created_at, updated_at FROM tabs WHERE id = ?';
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

// Update a tabs item by ID
export const updateTabsItem = async (id, updatedItem) => {
    await getTabsItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Stringify the productIds array before storing it in the database
    const productIdsJson = JSON.stringify(updatedItem.productIds);

    const sql = 'UPDATE tabs SET tabTitle = ?, productIds = ?, updated_at = ? WHERE id = ?';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedItem.tabTitle, productIdsJson, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a tabs item by ID
export const deleteTabsItem = async (id) => {
    const sql = 'DELETE FROM tabs WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
