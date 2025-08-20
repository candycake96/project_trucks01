// const sql = require("mssql");

// // Configuration for EmployeeAccessDB
// const configTruck = {
//   server: "LAPTOP-GRS8FSOJ",
//   database: "EmployeeAccessDB",
//   user: "admin",
//   password: "isylzjko@1234",
//   options: {
//     trustedConnection: true,
//     enableArithAbort: true,
//     trustServerCertificate: true,
//   },
// };

// // Function to execute queries on the database
// const executeQuery = async (query, params = {}) => {
//   let pool;
//   try {
//     // Ensure we close any previous connection
//     await sql.close();
//     console.log("Connecting to Truck database...");
//     pool = await sql.connect(configTruck); // Ensure connection is opened
//     console.log("Connected to Truck database");

//     const request = pool.request();

//     // Add parameters if present
//     for (const [key, value] of Object.entries(params)) {
//       request.input(key, value);
//     }

//     console.log("Executing query:", query);
//     const result = await request.query(query); // Execute query
//     console.log("Query executed successfully");
//     return result.recordset;
//   } catch (error) {
//     console.error("Query execution error (Truck):", error);
//     throw error;
//   } finally {
//     if (pool && pool.connected) {
//       console.log("Closing Truck database connection...");
//       await pool.close(); // Safely close the pool after each use
//     }
//   }
// };

// // Function for running stored procedures on EmployeeAccessDB
// const executeTableValuedQuery = async (query, params = {}) => {
//   let pool;
//   try {
//     // Ensure we close any previous connection
//     await sql.close();
//     console.log("Connecting to EmployeeAccessDB database...");
//     pool = await sql.connect(configTruck); // Reconnect on every query execution
//     console.log("Connected to EmployeeAccessDB database");

//     const request = pool.request();

//     // Add parameters if present
//     for (const [key, value] of Object.entries(params)) {
//       request.input(key, value);
//     }

//     console.log("Executing query:", query);
//     const result = await request.query(query); // Execute query
//     console.log("Query executed successfully");
//     return result.recordset;
//   } catch (error) {
//     console.error("Query execution error (EmployeeAccessDB):", error);
//     throw error;
//   } finally {
//     if (pool && pool.connected) {
//       console.log("Closing EmployeeAccessDB database connection...");
//       await pool.close(); // Safely close the pool after each use
//     }
//   }
// };

// // Close SQL connection after every query to ensure it's not left open
// const closeSQLConnection = async () => {
//   try {
//     await sql.close(); // Close the global connection pool after queries
//     console.log("SQL Connection closed");
//   } catch (error) {
//     console.error("Error closing SQL connection:", error);
//   }
// };

// module.exports = {
//   connectTruck: () => sql.connect(configTruck),
//   sql,
//   executeQuery,
//   executeTableValuedQuery,
//   closeSQLConnection,
// };
