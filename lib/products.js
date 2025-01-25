import db from '../config/db';

// Function to get all products
export const getAllProducts = async () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, name, description, price, quantity, images, 
                packageOptions, benefits, \`usage\`, \`storage\`, 
                application, applicationTitleSection, whyChoose, certifiedImages, 
                createdAt, updatedAt 
            FROM products
        `;
        db.query(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

// Function to add a product
export const addProduct = async (product) => {
    return new Promise((resolve, reject) => {
        if (!product.name || typeof product.name !== 'string') {
            reject(new Error(`Product name is missing or invalid: ${product.name}`));
            return;
        }

        // console.log(product);

        // Ensure images is always an array, even if a single image is provided
        product.images = Array.isArray(product.images) ? product.images : [product.images || 'product-image.png'];

        // Normalize the values to ensure proper handling
        product.price = product.price === '' ? null : product.price;
        product.quantity = product.quantity === '' ? null : product.quantity;

        // Clean up and ensure all fields are arrays (removes quotes)
        product.packageOptions = product.packageOptions.map(item => item.replace(/"/g, ''));
        product.benefits = product.benefits.map(item => item.replace(/"/g, ''));
        product.usage = product.usage.map(item => item.replace(/"/g, ''));
        product.storage = product.storage.map(item => item.replace(/"/g, ''));

        // Ensure application and whyChoose have the proper object format
        product.whyChoose = Array.isArray(product.whyChoose) ? product.whyChoose : [];
        product.application = Array.isArray(product.application) ? product.application : [];
        product.applicationTitleSection = Array.isArray(product.applicationTitleSection) ? product.applicationTitleSection : [];
        product.certifiedImages = Array.isArray(product.certifiedImages) ? product.certifiedImages : [];

        // Ensure the correct data format for each field
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const createTableSql = `
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                price TEXT,
                quantity TEXT,
                images JSON,
                packageOptions JSON,
                benefits JSON,
                \`usage\` JSON,
                \`storage\` JSON,
                application JSON,
                applicationTitleSection JSON,
                whyChoose JSON,
                certifiedImages JSON,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;

        db.query(createTableSql, (err) => {
            if (err) {
                reject(err);
                return;
            }

            db.query('SELECT COUNT(*) AS count FROM products WHERE name = ?', [product.name], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (rows[0].count > 0) {
                    reject(new Error('Product name already exists'));
                    return;
                }

                const sql = `
                INSERT INTO products (
                    name, description, price, quantity, images, 
                    packageOptions, benefits, \`usage\`, \`storage\`, 
                    application, applicationTitleSection, whyChoose, certifiedImages
                ) VALUES (
                    ?, ?, ?, ?, ?, 
                    ?, ?, ?, ?, 
                    ?, ?, ?, ?
                )
            `;
            
            db.query(
                sql,
                [
                    product.name, 
                    product.description, 
                    product.price, 
                    product.quantity, 
                    JSON.stringify(product.images),
                    JSON.stringify(product.packageOptions), 
                    JSON.stringify(product.benefits), 
                    JSON.stringify(product.usage), 
                    JSON.stringify(product.storage),
                    JSON.stringify(product.application), 
                    JSON.stringify(product.applicationTitleSection), 
                    JSON.stringify(product.whyChoose), 
                    JSON.stringify(product.certifiedImages)
                ],
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ id: result.insertId, ...product });
                }
            );            
            });
        });
    });
};

// Function to get a product by ID
export const getProductById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, name, description, price, quantity, images, 
                packageOptions, benefits, \`usage\`, \`storage\`, 
                application, applicationTitleSection, whyChoose, certifiedImages, 
                createdAt, updatedAt 
            FROM products WHERE id = ?
        `;
        db.query(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows.length === 0) {
                reject(new Error('Product not found'));
                return;
            }

            resolve(rows[0]);
        });
    });
};

// Function to update a product
export const updateProduct = async (id, updatedProduct) => {
    return new Promise((resolve, reject) => {
        // Ensure the product exists by checking its ID
        getProductById(id)
            .then(() => {
                if (!updatedProduct.name || typeof updatedProduct.name !== 'string') {
                    reject(new Error(`Product name is missing or invalid: ${updatedProduct.name}`));
                    return;
                }

                // Normalize images to ensure it's always an array
                updatedProduct.images = Array.isArray(updatedProduct.images) ? updatedProduct.images : [updatedProduct.images || 'product-image.png'];

                // Normalize other fields to ensure proper format
                updatedProduct.price = updatedProduct.price === '' ? null : updatedProduct.price;
                updatedProduct.quantity = updatedProduct.quantity === '' ? null : updatedProduct.quantity;

                // Clean up and ensure all fields are arrays (removes quotes)
                updatedProduct.packageOptions = updatedProduct.packageOptions.map(item => item.replace(/"/g, ''));
                updatedProduct.benefits = updatedProduct.benefits.map(item => item.replace(/"/g, ''));
                updatedProduct.usage = updatedProduct.usage.map(item => item.replace(/"/g, ''));
                updatedProduct.storage = updatedProduct.storage.map(item => item.replace(/"/g, ''));

                // Ensure application and whyChoose have the proper object format
                updatedProduct.whyChoose = Array.isArray(updatedProduct.whyChoose) ? updatedProduct.whyChoose : [];
                updatedProduct.application = Array.isArray(updatedProduct.application) ? updatedProduct.application : [];
                updatedProduct.applicationTitleSection = Array.isArray(updatedProduct.applicationTitleSection) ? updatedProduct.applicationTitleSection : [];
                updatedProduct.certifiedImages = Array.isArray(updatedProduct.certifiedImages) ? updatedProduct.certifiedImages : [];

                // Get the current timestamp for the update
                const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

                // SQL query to update the product
                const sql = `
                    UPDATE products SET 
                        name = ?, description = ?, price = ?, quantity = ?, images = ?, 
                        packageOptions = ?, benefits = ?, \`usage\` = ?, \`storage\` = ?, 
                        application = ?, applicationTitleSection = ?, whyChoose = ?, certifiedImages = ?, 
                        updatedAt = ? 
                    WHERE id = ?
                `;

                db.query(
                    sql,
                    [
                        updatedProduct.name, updatedProduct.description, updatedProduct.price, updatedProduct.quantity, JSON.stringify(updatedProduct.images),
                        JSON.stringify(updatedProduct.packageOptions), JSON.stringify(updatedProduct.benefits), JSON.stringify(updatedProduct.usage), JSON.stringify(updatedProduct.storage),
                        JSON.stringify(updatedProduct.application), JSON.stringify(updatedProduct.applicationTitleSection), JSON.stringify(updatedProduct.whyChoose), JSON.stringify(updatedProduct.certifiedImages),
                        now, id
                    ],
                    (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        // Check if the product was updated (i.e., result.affectedRows > 0)
                        if (result.affectedRows === 0) {
                            reject(new Error('Product not found or no changes were made.'));
                            return;
                        }

                        resolve(result);
                    }
                );
            })
            .catch((err) => {
                reject(err);
            });
    });
};

// Function to delete a product
export const deleteProduct = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM products WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};