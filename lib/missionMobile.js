import db from "../config/db";

// Fetch all missionMobile items
export const getAllMissionMobileItems = async () => {
    const sql = `
        SELECT id, smallImage1, smallImage2, smallImage3, smallImage4, 
               image1, image2, image3, image4, image5, 
               imageTitle1, imageTitle2, imageTitle3, imageTitle4, imageTitle5, 
               pioneerTitle, pioneerSubtitle, logo, smallLogo, 
               created_at, updated_at 
        FROM missionMobile
    `;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Add a new missionMobile item
export const addMissionMobileItem = async (item) => {
    // Function to create the missionMobile table if it doesn't exist
    const createMissionMobileTable = async () => {
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS missionMobile (
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
                imageTitle1 VARCHAR(255),
                imageTitle2 VARCHAR(255),
                imageTitle3 VARCHAR(255),
                imageTitle4 VARCHAR(255),
                imageTitle5 VARCHAR(255),
                pioneerTitle VARCHAR(255),
                pioneerSubtitle TEXT,
                logo TEXT,
                smallLogo TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `;

        return new Promise((resolve, reject) => {
            db.query(createTableSql, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                    return reject(err);
                }
                resolve();
            });
        });
    };

    try {
        // Validate the input item
        if (!item || typeof item !== 'object') {
            throw new Error('Invalid item object');
        }

        // Create the table if it doesn't exist
        await createMissionMobileTable();

        // Insert the new missionMobile item
        const sql = `
            INSERT INTO missionMobile 
            (smallImage1, smallImage2, smallImage3, smallImage4, 
            image1, image2, image3, image4, image5, 
            imageTitle1, imageTitle2, imageTitle3, imageTitle4, imageTitle5, 
            pioneerTitle, pioneerSubtitle, logo, smallLogo, 
            created_at, updated_at) 
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [
                item.smallImage1, item.smallImage2, item.smallImage3, item.smallImage4,
                item.image1, item.image2, item.image3, item.image4, item.image5,
                item.imageTitle1, item.imageTitle2, item.imageTitle3, item.imageTitle4,
                item.imageTitle5, item.pioneerTitle, item.pioneerSubtitle,
                item.logo, item.smallLogo, now, now
            ], (err, results) => {
                if (err) {
                    console.error('Error inserting item:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });

        return result;
    } catch (error) {
        console.error('Error in addMissionMobileItem:', error);
        throw error;
    }
};


// Fetch a specific missionMobile item by ID
export const getMissionMobileItemById = async (id) => {
    const sql = `
        SELECT id, smallImage1, smallImage2, smallImage3, smallImage4, 
               image1, image2, image3, image4, image5, 
               imageTitle1, imageTitle2, imageTitle3, imageTitle4, imageTitle5, 
               pioneerTitle, pioneerSubtitle, logo, smallLogo, 
               created_at, updated_at 
        FROM missionMobile 
        WHERE id = ?
    `;
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

// Update a missionMobile item by ID
export const updateMissionMobileItem = async (id, updatedItem) => {
    await getMissionMobileItemById(id); // Ensure the item exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = `
        UPDATE missionMobile SET 
            smallImage1 = ?, smallImage2 = ?, smallImage3 = ?, smallImage4 = ?, 
            image1 = ?, image2 = ?, image3 = ?, image4 = ?, image5 = ?, 
            imageTitle1 = ?, imageTitle2 = ?, imageTitle3 = ?, imageTitle4 = ?, imageTitle5 = ?, 
            pioneerTitle = ?, pioneerSubtitle = ?, 
            logo = ?, smallLogo = ?, 
            updated_at = ? 
        WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
        db.query(sql, [
            updatedItem.smallImage1, updatedItem.smallImage2, updatedItem.smallImage3, updatedItem.smallImage4,
            updatedItem.image1, updatedItem.image2, updatedItem.image3, updatedItem.image4, updatedItem.image5,
            updatedItem.imageTitle1, updatedItem.imageTitle2, updatedItem.imageTitle3, updatedItem.imageTitle4,
            updatedItem.imageTitle5, updatedItem.pioneerTitle, updatedItem.pioneerSubtitle, 
            updatedItem.logo, updatedItem.smallLogo, now, id
        ], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete a missionMobile item by ID
export const deleteMissionMobileItem = async (id) => {
    const sql = 'DELETE FROM missionMobile WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
