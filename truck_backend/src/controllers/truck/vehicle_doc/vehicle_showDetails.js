const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const baseUrl = process.env.BASE_URL;


module.exports = {
    VehicleGet: async (req, res) => {
        try {
            const query = `SELECT t.*, vt.*, ut.*,
            ct.car_type_id AS car_id, ct.car_type_name,
    b.id_branch AS branch, b.branch_name
FROM Truck_vehicle_registration t
LEFT JOIN Truck_vehicle_types vt ON t.vehicle_type_id = vt.vehicle_type_id
LEFT JOIN Truck_vehicle_usage_type ut ON t.usage_type_id = ut.usage_type_id
LEFT JOIN Truck_car_types ct ON t.car_type_id = ct.car_type_id
LEFT JOIN branches b ON t.id_branch = b.id_branch
WHERE status = 'active'
`;

            const result = await executeQueryEmployeeAccessDB(query);
            // console.log("🚀 ผลลัพธ์จากฐานข้อมูล:", result); // เพิ่ม log

            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                console.warn("⚠️ ไม่มีข้อมูลในตาราง Truck_vehicle_registration");
                res.status(404).json({ message: "No data found in Truck_vehicle_registration table" });
            }
        } catch (error) {
            console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูลรถ:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลรถ", error });
        }
    },

    VehicleDetailGetId: async (req, res) => {
        const {id} = req.params;
        const value = {reg_id: id};
        try {
            const query = `SELECT t.*, vt.vehicle_type_name, ut.usage_type,
            ct.car_type_id AS car_id, ct.car_type_name,
    b.id_branch AS branch, b.branch_name
FROM Truck_vehicle_registration t
LEFT JOIN Truck_vehicle_types vt ON t.vehicle_type_id = vt.vehicle_type_id
LEFT JOIN Truck_vehicle_usage_type ut ON t.usage_type_id = ut.usage_type_id
LEFT JOIN Truck_car_types ct ON t.car_type_id = ct.car_type_id
LEFT JOIN branches b ON t.id_branch = b.id_branch
            WHERE reg_id =  @reg_id`;

            const result = await executeQueryEmployeeAccessDB(query, value);

            if (result && result.length > 0) {
                            // เพิ่ม URL ของรูปภาพ
            const fileUrl = result.map(reg => ({
                ...reg, // คัดลอกข้อมูลเดิม
                file_download: reg.file_download 
                    ? `${baseUrl}/api/vehicle/uploads/${reg.file_download}`
                    : null, // ตรวจสอบว่ามีรูปภาพหรือไม่
            }));

                res.status(200).json(fileUrl);
            } else {
                console.warn("⚠️ ไม่มีข้อมูลในตาราง Truck_vehicle_registration");
                res.status(404).json({ message: "No data found in Truck_vehicle_registration table" });
            }
            
        } catch (error) {
            console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูลรถ:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลรถ", error });
        }
    }

};
