import db from "../config/db";

// Fetch all title and subtext entries
export const getAllTitleAndSubtextEntries = async () => {
    const sql = 'SELECT id, page_name, title, subtext, hide, created_at, updated_at FROM TitleAndSubtext';
    return new Promise((resolve, reject) => {
      db.query(sql, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  };
  
  // Add a new title and subtext entry
  export const addTitleAndSubtextEntry = async (entry) => {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS TitleAndSubtext (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_name VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtext TEXT,
        hide BOOLEAN NOT NULL DEFAULT 0,
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
    const sql = 'INSERT INTO TitleAndSubtext (page_name, title, subtext, hide, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
      db.query(sql, [entry.page_name, entry.title, entry.subtext, entry.hide || 0, now, now], (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, ...entry, created_at: now, updated_at: now });
      });
    });
  };
  
  // Fetch a specific title and subtext entry by ID
  export const getTitleAndSubtextEntryById = async (id) => {
    const sql = 'SELECT id, page_name, title, subtext, hide, created_at, updated_at FROM TitleAndSubtext WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, rows) => {
        if (err) return reject(err);
        if (rows.length === 0) {
          return reject(new Error('Entry not found'));
        }
        resolve(rows[0]);
      });
    });
  };
  
  // Update a title and subtext entry by ID
  export const updateTitleAndSubtextEntry = async (id, updatedEntry) => {
    await getTitleAndSubtextEntryById(id); // Ensure the entry exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE TitleAndSubtext SET page_name = ?, title = ?, subtext = ?, hide = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [updatedEntry.page_name, updatedEntry.title, updatedEntry.subtext, updatedEntry.hide, now, id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
  
  // Delete a title and subtext entry by ID
  export const deleteTitleAndSubtextEntry = async (id) => {
    const sql = 'DELETE FROM TitleAndSubtext WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };