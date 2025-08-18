const sql = require("mssql");

const config = {
  server: "LAPTOP-GRS8FSOJ", // Add port number if necessary
  database: "Truck",
  user: "admin",
  password: "isylzjko@1234",
  options: {
    trustedConnection: true, // ใช้ Windows Authentication
    enableArithAbort: true,
    trustServerCertificate: true, // Accept self-signed certificates
  },
};


// ฟังก์ชันสำหรับรัน query
const executeQuery = async (query, params = {}) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    // เพิ่ม parameter ถ้ามี
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Query execution error:", error);
    throw error;
  }
};

// ฟังก์ชันสำหรับรัน Table-Valued Query
const executeTableValuedQuery = async (query, params = {}) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    // เพิ่ม parameter ถ้ามี
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }

    const result = await request.execute(query); // สำหรับ Stored Procedure
    return result.recordsets;
  } catch (error) {
    console.error("Table-Valued Query execution error:", error);
    throw error;
  }
};

module.exports = {
  connect: () => sql.connect(config),
  sql,
  executeQuery,
  executeTableValuedQuery,

};
