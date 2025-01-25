import db from '../config/db';
import bcrypt from 'bcryptjs';

export const getAllUsers = async () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, username, firstName, lastName, createdAt, updatedAt FROM users';
        db.query(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

export const addUser = async (user) => {
    return new Promise((resolve, reject) => {
        // Ensure user.password is defined and is a string
        if (!user.password || typeof user.password !== 'string') {
            reject(new Error('Password is missing or invalid'));
            return;
        }

        // SQL query to create the users table if it does not exist
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                hash VARCHAR(255) NOT NULL,
                firstName VARCHAR(255),
                lastName VARCHAR(255),
                createdAt DATETIME,
                updatedAt DATETIME
            )
        `;

        // Execute the query to create the table
        db.query(createTableSql, (err) => {
            if (err) {
                reject(err);
                return;
            }

            // Check if the username already exists in the database
            db.query('SELECT COUNT(*) AS count FROM users WHERE username = ?', [user.username], async (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (rows[0].count > 0) {
                    reject(new Error('Username already exists'));
                    return;
                }

                // Hash the password before storing it
                bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format to MySQL datetime

                    const sql = 'INSERT INTO users (username, hash, firstName, lastName, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)';
                    db.query(sql, [user.username, hashedPassword, user.firstName, user.lastName, now, now], (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                });
            });
        });
    });
};

export const loginUser = async (username, password) => {
  return new Promise((resolve, reject) => {
      // Fetch user data based on the provided username
      db.query('SELECT * FROM users WHERE username = ?', [username], async (err, rows) => {
          if (err) {
              reject(err);
              return;
          }

          if (rows.length === 0) {
              reject(new Error('User not found'));
              return;
          }

          const user = rows[0];
          
          // Compare the provided password with the hashed password stored in the database
          bcrypt.compare(password, user.hash, (err, isMatch) => {
              if (err) {
                  reject(err);
                  return;
              }

              if (!isMatch) {
                  reject(new Error('Incorrect password'));
                  return;
              }

              // Passwords match, resolve with the user data
              resolve(user);
          });
      });
  });
};

export const deleteUser = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM users WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};

export const getUserById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, username, firstName, lastName, createdAt, updatedAt FROM users WHERE id = ?';
        db.query(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows.length === 0) {
                reject(new Error('User not found'));
                return;
            }

            resolve(rows[0]);
        });
    });
};

export const updateUser = async (id, updatedUser) => {
    return new Promise((resolve, reject) => {
        // Ensure user.password is defined and is a string
        if (updatedUser.password && typeof updatedUser.password !== 'string') {
            reject(new Error('Password is invalid'));
            return;
        }

        // Check if the user exists
        getUserById(id)
            .then(() => {
                // If password is provided, hash it
                if (updatedUser.password) {
                    bcrypt.hash(updatedUser.password, 10, async (err, hashedPassword) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format to MySQL datetime

                        const sql = 'UPDATE users SET firstName = ?, lastName = ?, hash = ?, updatedAt = ? WHERE id = ?';
                        db.query(sql, [updatedUser.firstName, updatedUser.lastName, hashedPassword, now, id], (err, result) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(result);
                        });
                    });
                } else {
                    // If password is not provided, update other fields only
                    const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format to MySQL datetime

                    const sql = 'UPDATE users SET firstName = ?, lastName = ?, updatedAt = ? WHERE id = ?';
                    db.query(sql, [updatedUser.firstName, updatedUser.lastName, now, id], (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};
