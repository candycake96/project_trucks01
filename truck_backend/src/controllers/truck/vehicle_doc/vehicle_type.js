const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    DetailsVehicleType: async (req, res) => {
       const query = `SELECT * FROM Truck_vehicle_types `;

       try{
        const result = await executeQueryEmployeeAccessDB(query);

        if ( result && result.length > 0 ) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No data found in Truck car type table"})
        }
       } catch (error) {
        console.error("Database query failed", error);
        res.status(500).json({message: "Database query failed", error: error.message});
       }
    },

    // เพิ่มข้อมูล
vendor_type_add: async (req, res) => {
    try {
        const { vendor_type_name } = req.body;

        if (!vendor_type_name) {
            return res.status(400).json({ message: "vendor_type_name is required" });
        }

        const query = `
            INSERT INTO Truck_vehicle_types (vendor_type_name)
            VALUES (@vendor_type_name);
        `;

        const values = { vendor_type_name };
        const result = await executeQueryEmployeeAccessDB(query, values);

        if (result && result.affectedRows > 0) {
            res.status(200).json({
                message: 'เพิ่มประเภทองค์กรของผู้จำหน่ายเรียบร้อยแล้ว'
            });
        } else {
            res.status(400).json({
                message: "ไม่สามารถเพิ่มประเภทองค์กรของผู้จำหน่ายได้"
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


vendor_type_update: async (req, res) => {
    try {const {id} = req.params;
        const { vendor_type_name } = req.body;

        if (!vendor_type_name) {
            return res.status(400).json({ message: "vendor_type_name is required" });
        }

        const query = `
            UPDATE  Truck_vehicle_types SET vendor_type_name = @vendor_type_name
            WHERE  vendor_type_id = @vendor_type_id;
        `;

        const values = { vendor_type_name: vendor_type_name,  vendor_type_id: id};
        const result = await executeQueryEmployeeAccessDB(query, values);

        if (result && result.affectedRows > 0) {
            res.status(200).json({
                message: 'แก้ไขประเภทองค์กรของผู้จำหน่ายเรียบร้อยแล้ว'
            });
        } else {
            res.status(400).json({
                message: "ไม่สามารถแก้ไขประเภทองค์กรของผู้จำหน่ายได้"
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

};

