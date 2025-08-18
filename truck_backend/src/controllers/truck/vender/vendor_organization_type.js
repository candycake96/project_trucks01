const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    vendor_organization_type_show: async (req, res) => {
        try {
        const query = `SELECT * FROM Truck_vendor_organization_type`
        const result = await executeQueryEmployeeAccessDB(query);

        if ( result && result.length > 0 ) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No data found in Truck_vendor_organization_type table"})
        }
       } catch (error) {
        console.error("Database query failed", error);
        res.status(500).json({message: "Database query failed", error: error.message});
       }
    },

// เพิ่มข้อมูล
vendor_organization_type_add: async (req, res) => {
    try {
        const { organization_type_name } = req.body;

        if (!organization_type_name) {
            return res.status(400).json({ message: "organization_type_name is required" });
        }

        const query = `
            INSERT INTO Truck_vendor_organization_type (organization_type_name)
            VALUES (@organization_type_name);
        `;

        const values = { organization_type_name };
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


vendor_organization_type_update: async (req, res) => {
    try {const {id} = req.params;
        const { organization_type_name } = req.body;

        if (!organization_type_name) {
            return res.status(400).json({ message: "organization_type_name is required" });
        }

        const query = `
            UPDATE  Truck_vendor_organization_type SET organization_type_name = @organization_type_name
            WHERE  organization_type_id = @organization_type_id;
        `;

        const values = { organization_type_name: organization_type_name,  organization_type_id: id};
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


}

