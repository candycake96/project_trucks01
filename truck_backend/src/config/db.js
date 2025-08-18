require('dotenv').config();
const sql = require("mssql");

// Configuration for EmployeeAccessDB
const configEmployeeAccessDB = {
  server: process.env.DB_SERVER, // หรือ IP Address เช่น "127.0.0.1"
  database: process.env.DB_NAME,
  user: process.env.DB_USER, // ตรวจสอบชื่อผู้ใช้
  password: process.env.DB_PASSWORD, // ตรวจสอบรหัสผ่าน
  options: {
    encrypt: false, // ปิดการเข้ารหัสหากไม่จำเป็น
    trustServerCertificate: true, // หากใช้ self-signed certificate
    enableArithAbort: true, // ปรับให้คำนวณกรณีที่เกิดข้อผิดพลาดทางคณิตศาสตร์
  },
  pool: {
    max: 10, // เพิ่มการเชื่อมต่อสูงสุด
    min: 2,  // เก็บการเชื่อมต่ออย่างน้อย 2 การเชื่อมต่อ
    idleTimeoutMillis: 30000, // ปิดการเชื่อมต่อที่ไม่ได้ใช้งานหลังจาก 30 วินาที
  }
};

let pool;

// Function to get the pool connection
const getPool = async () => {
  if (!pool || pool.connected === false) {
    pool = await sql.connect(configEmployeeAccessDB);  // Reconnect if pool is not available or disconnected
  }
  return pool;
};

// Function for executing SQL queries
const executeQueryEmployeeAccessDB = async (query, params = {}, debug = false) => {
  try {
    const pool = await getPool();  // Reuse pool connection
    if (debug) console.log("Executing query:", query, "with params:", params);

    const request = pool.request();

    // Add parameters if present
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }

    const result = await request.query(query);
    if (debug) console.log("Query executed successfully:", result);

    // Return result based on the query type
    if (query.trim().toUpperCase().startsWith("SELECT")) {
      return result.recordset;  // Return records for SELECT queries
    } else if (query.trim().toUpperCase().startsWith("INSERT") && result.recordset?.length) {
      return result.recordset;  // Return output from INSERTED.<column> for INSERT queries
    } else if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return { affectedRows: result.rowsAffected[0] };  // Return affected rows count
    }

    return null;  // Return null for non-select queries that don't affect rows
  } catch (error) {
    console.error("Query execution error (Employee Access):", { query, params, error });
    throw error;
  }
};

// Function to close SQL connection pool on app shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await sql.close();  // Close connection pool on app shutdown
  console.log("SQL connection closed.");
  process.exit();
});



const executeSelectQuery = async (query, params = {}, debug = false) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    if (debug) console.log("Executing SELECT query:", query, params);
    const result = await request.query(query);
    if (debug) console.log("SELECT executed:", result);
    return result.recordset; // คืนข้อมูล array rows
  } catch (error) {
    console.error("Error executing SELECT query:", { query, params, error });
    throw error;
  }
};

const executeNonQuery = async (query, params = {}, debug = false) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    if (debug) console.log("Executing non-SELECT query:", query, params);
    const result = await request.query(query);
    if (debug) console.log("Non-SELECT executed:", result);
    return { affectedRows: result.rowsAffected[0] || 0 };
  } catch (error) {
    console.error("Error executing non-SELECT query:", { query, params, error });
    throw error;
  }
};


module.exports = {
  connectEmployeeAccessDB: () => sql.connect(configEmployeeAccessDB),
  sql,
  executeQueryEmployeeAccessDB,
  executeSelectQuery,
  executeNonQuery,
};


