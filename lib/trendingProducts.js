import db from "../config/db";

// Fetch all trending products
export const getAllTrendingProducts = async () => {
    const sql = 'SELECT id, title, subtitle, image, content, link, created_at, updated_at FROM TrendingProducts';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new trending product
export const addTrendingProduct = async (product) => {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS TrendingProducts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            subtitle VARCHAR(255),
            image TEXT NOT NULL,
            content TEXT,
            link VARCHAR(255),
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
    const sql = 'INSERT INTO TrendingProducts (title, subtitle, image, content, link, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
        db.query(sql, [product.title, product.subtitle, product.image, product.content, product.link, now, now], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...product, created_at: now, updated_at: now });
        });
    });
};

// Fetch a specific trending product by ID
export const getTrendingProductById = async (id) => {
    const sql = 'SELECT id, title, subtitle, image, content, link, created_at, updated_at FROM TrendingProducts WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) {
                return reject(new Error('Product not found'));
            }
            resolve(rows[0]);
        });
    });
};

// Update a trending product by ID
export const updateTrendingProduct = async (id, updatedProduct) => {
    await getTrendingProductById(id); // Ensure the product exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = 'UPDATE TrendingProducts SET title = ?, subtitle = ?, image = ?, content = ?, link = ?, updated_at = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [updatedProduct.title, updatedProduct.subtitle, updatedProduct.image, updatedProduct.content, updatedProduct.link, now, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a trending product by ID
export const deleteTrendingProduct = async (id) => {
    const sql = 'DELETE FROM TrendingProducts WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
