const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    setting_models_show: async (req, res) => {
        try {
            const sqlInsert = `
                SELECT 
                    m.model_id,
                    m.brand, 
                    m.model,
                    STUFF((
                        SELECT ', ' + r2.reg_number
                        FROM Truck_vehicle_registration r2
                        WHERE r2.model_id = m.model_id
                        ORDER BY r2.reg_number ASC
                        FOR XML PATH(''), TYPE
                    ).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS reg_numbers
                FROM Truck_vehicle_models m
                ORDER BY m.model_id DESC;
            `;

            const result = await executeQueryEmployeeAccessDB(sqlInsert);
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "ไม่สามารถบันทึกข้อมูลได้" })
            }

        } catch (error) {
            console.error("Error in Truck_vehicle_models:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },

    setting_models_add: async (req, res) => {
        try {
            const {
                brand,
                model
            } = req.body;

            let query = `INSERT INTO Truck_vehicle_models ( brand, model) VALUES ( @brand, @model );`
            const results = await executeQueryEmployeeAccessDB(query, {
                brand: brand,
                model: model
            });
            res.status(200).json({ success: true, message: "Auto Car data added successfully" });
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred while adding auto car data.",
                error: error.message,
            });
        }
    },

    // แก้ไขข้อมูล 
    setting_models_update: async (req, res) => {
        try {
            const {
                brand,
                model
            } = req.body;
            const { id } = req.params;
            let query = `UPDATE Truck_vehicle_models SET  brand = @brand, model = @model WHERE model_id = @model_id ;`
            const results = await executeQueryEmployeeAccessDB(query, {
                brand: brand,
                model: model,
                model_id: id
            });
            res.status(200).json({ success: true, message: "Auto Car data added successfully" });
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred while adding auto car data.",
                error: error.message,
            });
        }
    },

    // ลบข้อมูล
    setting_models_delete: async (req, res) => {
        try {
            const { id } = req.params;

            const query = `
            DELETE FROM Truck_vehicle_models
            WHERE model_id = @model_id;
        `;

            const results = await executeQueryEmployeeAccessDB(query, {
                model_id: id,
            });

            res.status(200).json({
                success: true,
                message: "ลบข้อมูลรุ่นรถสำเร็จ",
            });
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({
                success: false,
                message: "เกิดข้อผิดพลาดขณะลบข้อมูลรุ่นรถ",
                error: error.message,
            });
        }
    },


};


