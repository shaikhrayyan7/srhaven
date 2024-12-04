// import { Injectable } from '@angular/core';
// import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection } from '@capacitor-community/sqlite';

// @Injectable({
//   providedIn: 'root',
// })
// export class DatabaseService {
//   private sqliteConnection: SQLiteConnection;
//   private db: SQLiteDBConnection | null = null;

//   constructor() {
//     this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
//   }

//   // Initialize Database Connection
//   async initializeDatabase(): Promise<void> {
//     try {
//       // Create connection to the database
//       this.db = await this.sqliteConnection.createConnection(
//         'srhaven',     // Database name
//         false,         // Not encrypted
//         'no-encryption',
//         1,             // Database version
//         false          // Read-only flag
//       );

//       await this.db.open();
//       console.log('Database connection initialized.');

//       // Create or update tables
//       await this.createTables();
//     } catch (error) {
//       console.error('Error initializing database:', error);
//     }
//   }

//   // Create or update tables
//   private async createTables(): Promise<void> {
//     try {
//       if (this.db) {
//         // Check if the table exists
//         const tableExistsQuery = `
//           SELECT name FROM sqlite_master WHERE type='table' AND name='users';
//         `;
//         const tableResult = await this.db.query(tableExistsQuery);

//         if (tableResult.values && tableResult.values.length > 0) {
//           console.log('Users table exists. Checking for updates.');

//           // Get existing columns
//           const checkColumnsQuery = `PRAGMA table_info(users);`;
//           const columnInfo = await this.db.query(checkColumnsQuery);
//           const columns = columnInfo.values?.map((col: any) => col.name);

//           // Add first_name column if it doesn't exist
//           if (columns && !columns.includes('first_name')) {
//             const addFirstNameColumn = `ALTER TABLE users ADD COLUMN first_name TEXT;`;
//             await this.db.execute(addFirstNameColumn);

//             // Migrate data from old name column to first_name
//             const migrateDataQuery = `UPDATE users SET first_name = name;`;
//             await this.db.execute(migrateDataQuery);

//             console.log('First name column added and data migrated.');
//           }

//           // Add last_name column if it doesn't exist
//           if (columns && !columns.includes('last_name')) {
//             const addLastNameColumn = `ALTER TABLE users ADD COLUMN last_name TEXT DEFAULT '';`;
//             await this.db.execute(addLastNameColumn);
//             console.log('Last name column added.');
//           }
//         } else {
//           console.log('Users table does not exist. Creating a new one.');

//           // Create the users table
//           const createUserTable = `
//             CREATE TABLE IF NOT EXISTS users (
//               id INTEGER PRIMARY KEY AUTOINCREMENT,
//               first_name TEXT NOT NULL,
//               last_name TEXT NOT NULL,
//               email TEXT NOT NULL UNIQUE,
//               password TEXT NOT NULL
//             );
//           `;
//           await this.db.execute(createUserTable);
//           console.log('Users table created successfully.');
//         }
//       }
//     } catch (error) {
//       console.error('Error creating or updating tables:', error);
//     }
//   }

//   // Insert a new user into the database
//   async insertUser(firstName: string, lastName: string, email: string, password: string): Promise<boolean> {
//     try {
//       const insertQuery = `
//         INSERT INTO users (first_name, last_name, email, password)
//         VALUES (?, ?, ?, ?);
//       `;

//       if (this.db) {
//         // Execute the query to insert the user
//         const result = await this.db.run(insertQuery, [firstName, lastName, email, password]);

//         // Check if rows were affected
//         if (result.changes && result.changes.changes !== undefined && result.changes.changes > 0) {
//           console.log('User added successfully.');
//           return true;
//         } else {
//           console.error('User insertion failed or no changes made.');
//         }
//       }
//     } catch (error: any) {
//       console.error('Error adding user:', error.message || error);
//     }
//     return false;
//   }

//   // Retrieve all users from the database
//   async getAllUsers(): Promise<any[]> {
//     try {
//       const query = 'SELECT * FROM users';
//       const result = await this.db?.query(query);

//       if (result && result.values) {
//         return result.values;
//       } else {
//         console.error('No users found.');
//       }
//     } catch (error: any) {
//       console.error('Error retrieving users:', error.message || error);
//     }
//     return [];
//   }

//   // Close the database connection
//   async closeDatabase(): Promise<void> {
//     try {
//       if (this.db) {
//         await this.sqliteConnection.closeConnection('srhaven', false);
//         console.log('Database connection closed.');
//       }
//     } catch (error) {
//       console.error('Error closing database connection:', error);
//     }
//   }
// }
