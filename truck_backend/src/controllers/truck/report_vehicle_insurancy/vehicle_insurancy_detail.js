const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    vehicle_insurancy_details: async (req, res) => {
        try {
            const sql = `
SELECT 
    r.reg_id,
    r.reg_number,
    r.reg_date,
    r.car_type_id,
    r.operators,
    r.owner_name,
	b.branch_name,
    ct.car_type_name,
    tx.tax_id,
    tx.tax_date_end, 
    tx.price AS tax_price,
    act.act_id,
    act.act_date_end,
    act.price AS act_price,

    -- insurance vehicle ล่าสุด
    ins_vehicle.insurance_id AS vehicle_insurance_id,
    ins_vehicle_class.insurance_class AS vehicle_insurance_class,
    ins_vehicle.insurance_end_date AS vehicle_insurance_date_end,
    ins_vehicle.insurance_converage_amount AS vehicle_insurance_price,

    -- insurance goods ล่าสุด
    ins_goods.insurance_id AS goods_insurance_id,
    ins_goods_class.insurance_class AS goods_insurance_class,
    ins_goods.insurance_end_date AS goods_insurance_date_end,
    ins_goods.insurance_converage_amount AS goods_insurance_price

FROM Truck_vehicle_registration r
INNER JOIN Truck_car_types ct 
    ON ct.car_type_id = r.car_type_id

-- สาขา
INNER JOIN branches b ON b.id_branch = r.id_branch

-- ภาษีล่าสุด
LEFT JOIN (
    SELECT t1.*
    FROM Truck_vehicle_tax t1
    INNER JOIN (
        SELECT reg_id, MAX(created_at) AS latest_tax
        FROM Truck_vehicle_tax
        GROUP BY reg_id
    ) t2 ON t1.reg_id = t2.reg_id AND t1.created_at = t2.latest_tax
) tx ON tx.reg_id = r.reg_id

-- พรบ. ล่าสุด
LEFT JOIN (
    SELECT t1.*
    FROM Truck_vehicle_act t1
    INNER JOIN (
        SELECT reg_id, MAX(created_at) AS latest_act
        FROM Truck_vehicle_act
        GROUP BY reg_id
    ) t2 ON t1.reg_id = t2.reg_id AND t1.created_at = t2.latest_act
) act ON act.reg_id = r.reg_id

-- insurance vehicle ล่าสุด
LEFT JOIN (
    SELECT t1.*
    FROM Truck_car_insurance t1
    INNER JOIN (
        SELECT insurance_vehicle_id, MAX(created_at) AS latest_vehicle
        FROM Truck_car_insurance
        WHERE coverage_id = '1'
        GROUP BY insurance_vehicle_id
    ) t2 ON t1.insurance_vehicle_id = t2.insurance_vehicle_id 
         AND t1.created_at = t2.latest_vehicle
) ins_vehicle ON ins_vehicle.insurance_vehicle_id = r.reg_id
LEFT JOIN Truck_car_insurance_class ins_vehicle_class 
    ON ins_vehicle_class.id = ins_vehicle.class_id

-- insurance goods ล่าสุด
LEFT JOIN (
    SELECT t1.*
    FROM Truck_car_insurance t1
    INNER JOIN (
        SELECT insurance_vehicle_id, MAX(created_at) AS latest_goods
        FROM Truck_car_insurance
        WHERE coverage_id = '2'
        GROUP BY insurance_vehicle_id
    ) t2 ON t1.insurance_vehicle_id = t2.insurance_vehicle_id 
         AND t1.created_at = t2.latest_goods
) ins_goods ON ins_goods.insurance_vehicle_id = r.reg_id
LEFT JOIN Truck_car_insurance_class ins_goods_class 
    ON ins_goods_class.id = ins_goods.class_id

WHERE r.status = 'active';
      `;
            const results = await executeQueryEmployeeAccessDB(sql);




            res.status(200).json({ success: true, results });

        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({
                success: false,
                message: "เกิดข้อผิดพลาดในการดึงข้อมูลแผนการบำรุงรักษา",
                error: error.message,
            });
        }
    },


    // api เส้นรายงานสรุป search
vehicle_insurancy_details_search: async (req, res) => {
    try {
        const { date_start, date_end } = req.body;

        const sql = `
SELECT 
    r.reg_id,
    r.reg_number,
    r.reg_date,
    r.car_type_id,
    r.operators,
    r.owner_name,
    b.branch_name,
    ct.car_type_name,
    tx.tax_id,
    tx.tax_date_end, 
    tx.price AS tax_price,
    act.act_id,
    act.act_date_end,
    act.price AS act_price,
    ins_vehicle.insurance_id AS vehicle_insurance_id,
    ins_vehicle_class.insurance_class AS vehicle_insurance_class,
    ins_vehicle.insurance_end_date AS vehicle_insurance_date_end,
    ins_vehicle.insurance_converage_amount AS vehicle_insurance_price,
    ins_goods.insurance_id AS goods_insurance_id,
    ins_goods_class.insurance_class AS goods_insurance_class,
    ins_goods.insurance_end_date AS goods_insurance_date_end,
    ins_goods.insurance_converage_amount AS goods_insurance_price

FROM Truck_vehicle_registration r
INNER JOIN Truck_car_types ct ON ct.car_type_id = r.car_type_id
INNER JOIN branches b ON b.id_branch = r.id_branch

-- ภาษีทั้งหมด
LEFT JOIN Truck_vehicle_tax tx 
    ON tx.reg_id = r.reg_id
    AND tx.tax_date_end BETWEEN @date_start AND @date_end

-- พรบ. ทั้งหมด
LEFT JOIN Truck_vehicle_act act 
    ON act.reg_id = r.reg_id
    AND act.act_date_end BETWEEN @date_start AND @date_end

-- insurance vehicle ทั้งหมด
LEFT JOIN Truck_car_insurance ins_vehicle
    ON ins_vehicle.insurance_vehicle_id = r.reg_id
    AND ins_vehicle.coverage_id = '1'
    AND ins_vehicle.insurance_end_date BETWEEN @date_start AND @date_end
LEFT JOIN Truck_car_insurance_class ins_vehicle_class 
    ON ins_vehicle_class.id = ins_vehicle.class_id

-- insurance goods ทั้งหมด
LEFT JOIN Truck_car_insurance ins_goods
    ON ins_goods.insurance_vehicle_id = r.reg_id
    AND ins_goods.coverage_id = '2'
    AND ins_goods.insurance_end_date BETWEEN @date_start AND @date_end
LEFT JOIN Truck_car_insurance_class ins_goods_class 
    ON ins_goods_class.id = ins_goods.class_id 

WHERE r.status = 'active';
`;

        const results = await executeQueryEmployeeAccessDB(sql, {
            date_start,
            date_end
        });

        res.status(200).json({ success: true, results });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล vehicle_insurancy_details_search",
            error: error.message,
        });
    }
}

};
