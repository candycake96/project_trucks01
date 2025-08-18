const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    vendor_service_types_show: async (req, res) => {
        try {
        const query = `SELECT * FROM Truck_vendor_service_types`
        const result = await executeQueryEmployeeAccessDB(query);

        if ( result && result.length > 0 ) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No data found in Truck_vendor_service_types table"})
        }
       } catch (error) {
        console.error("Database query failed", error);
        res.status(500).json({message: "Database query failed", error: error.message});
       }
    },

    // เพิ่มข้อมูล
vendor_service_types_add: async (req, res) => {
    try {
        const { service_name } = req.body;
console.log('test', service_name);
console.log("Request Body:", req.body);
        
if (!service_name) {
            return res.status(400).json({ message: "service_name is required" });
        }

        const query = `
            INSERT INTO Truck_vendor_service_types (service_name)
            VALUES (@service_name);
        `;

        const values = { service_name: service_name };
        const result = await executeQueryEmployeeAccessDB(query, values);

        if (result && result.affectedRows > 0) {
            res.status(200).json({
                message: 'เพิ่มหมวดหมู่ของผู้จำหน่ายเรียบร้อยแล้ว'
            });
        } else {
            res.status(400).json({
                message: "ไม่สามารถเพิ่มหมวดหมู่ของผู้จำหน่ายได้"
            });
        }

    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดระหว่างบันทึกข้อมูล",
            error: error.message
        });
    }
},


vendor_service_types_update: async (req, res) => {
    try {
        const {id} = req.params;
        const { service_name } = req.body;

        if (!service_name) {
            return res.status(400).json({ message: "service_name is required" });
        }

        const query = `
            UPDATE  Truck_vendor_service_types SET service_name = @service_name
            WHERE  service_id = @service_id;
        `;

        const values = { service_name: service_name,  service_id: id};
        const result = await executeQueryEmployeeAccessDB(query, values);

        if (result && result.affectedRows > 0) {
            res.status(200).json({
                message: 'แก้ไขหมวดหมู่ของผู้จำหน่ายเรียบร้อยแล้ว'
            });
        } else {
            res.status(400).json({
                message: "ไม่สามารถแก้ไขหมวดหมู่ของผู้จำหน่ายได้"
            });
        }

    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดระหว่างบันทึกข้อมูล",
            error: error.message
        });
    }
},

}

