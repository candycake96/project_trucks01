const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    car_insurance_details: async (req, res) => {
        const { id } = req.params;
        const query = `SELECT 
    i.insurance_id, 
    i.insurance_type,
    i.insurance_company,
    i.insurance_start_date,
    i.insurance_end_date,
    i.insurance_converage_amount,
    i.insurance_premium,
    i.insurance_vehicle_id,
    i.insurance_file,
    i.class_id,
    i.coverage_id,
    r.reg_id,
    r.reg_number,
    CASE 
        WHEN i.insurance_end_date IS NULL THEN 'No Insurance'
        WHEN i.insurance_end_date < GETDATE() THEN 'หมดอายุ'
        WHEN DATEDIFF(DAY, GETDATE(), i.insurance_end_date) <= 30 THEN 'ใกล้หมดอายุ'
        ELSE 'ปกติ'
    END AS status,
    c.insurance_class,
    ct.coverage_type
FROM Truck_car_insurance i
INNER JOIN Truck_vehicle_registration r ON r.reg_id = i.insurance_vehicle_id
    INNER JOIN Truck_car_insurance_class c ON c.id = i.class_id
    INNER JOIN Truck_car_insurance_coverage_type ct ON ct.id = i.coverage_id
WHERE insurance_vehicle_id = @insurance_vehicle_id


        `;

    
        const value = {insurance_vehicle_id: id};
        try {

            const result = await executeQueryEmployeeAccessDB(query, value);

            if (result && result.length > 0) {
                const fileUrl = result.map(reg => ({
                    ...reg, // คัดลอกข้อมูลเดิม
                    insurance_file: reg.insurance_file 
                        ? `${req.protocol}://${req.get('host')}/api/insurance_doc/${reg.insurance_file}`
                        : null, // ตรวจสอบว่ามีรูปภาพหรือไม่
                }));
                res.status(200).json(fileUrl);
            } else {
                res.status(404).json({ message: "No data found in Insurance type table" })
            }

        } catch (error) {
            console.warn("⚠️ ไม่มีข้อมูลในตาราง Truck_car_insurance");
            res.status(500).json({ message: "No data found in Truck_car_insurance table" });
        }
    },

    car_insurance_datails_all: async (req, res) => {
        try {
            const query = `SELECT 
     r.reg_id,
    r.reg_number,
    r.status AS reg_status,
    t.car_type_name,
    i.insurance_type,
    i.insurance_company,
    i.insurance_start_date,
    i.insurance_end_date,
    i.class_id,
    i.coverage_id,
    b.branch_name,
    CASE 
        WHEN i.insurance_end_date IS NULL THEN 'No Insurance'
        WHEN i.insurance_end_date < GETDATE() THEN 'หมดอายุ'
        WHEN DATEDIFF(DAY, GETDATE(), i.insurance_end_date) <= 30 THEN 'ใกล้หมดอายุ'
        ELSE 'ปกติ'
    END AS status
FROM Truck_vehicle_registration r

LEFT JOIN (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY insurance_vehicle_id, insurance_type 
            ORDER BY insurance_end_date DESC
        ) AS rn
    FROM Truck_car_insurance
) i ON r.reg_id = i.insurance_vehicle_id AND i.rn = 1

JOIN Truck_car_types t ON t.car_type_id = r.car_type_id
JOIN branches b ON b.id_branch = r.id_branch
WHERE  r.status = 'active'
;
`

            const result = await executeQueryEmployeeAccessDB(query);
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in Insurance type table" })
            }

        } catch (error) {
            console.warn("⚠️ ไม่มีข้อมูลในตาราง Truck_car_insurance");
            res.status(500).json({ message: "No data found in Truck_car_insurance table" });
        }
    },

   
}