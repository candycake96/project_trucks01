const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    AutoCarDetails: async (req, res) => {
        const { id } = req.params;

        const query = `SELECT * FROM Truck_auto_loans WHERE reg_id = @reg_id`; // ถ้าใช้ MSSQL
        const values = { reg_id: id }; // ต้องให้ key ตรงกับตัวแปรใน SQL

        try {
            const result = await executeQueryEmployeeAccessDB(query, values);

            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in Truck_auto_loans table" });
            }
        } catch (error) {
            console.error("Database query failed", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    }
};
