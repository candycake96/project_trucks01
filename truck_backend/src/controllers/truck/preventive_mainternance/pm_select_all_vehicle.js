const { executeSelectQuery } = require('../../../config/db');

module.exports = {
    pm_select_all_vehicle: async (req, res) => {
        try {
            const query = `
                            WITH MileageOrdered AS (
                        SELECT
                            t1.id,
                            t1.reg_id,
                            t1.emp_id,
                            t1.recorded_date,
                            t1.odometer,
                            t1.status,
                            t1.notes,
                            t2.fname,
                            t2.lname,
                            ROW_NUMBER() OVER (PARTITION BY t1.reg_id ORDER BY t1.recorded_date, t1.id) AS rn,
                            LAG(t1.odometer) OVER (PARTITION BY t1.reg_id ORDER BY t1.recorded_date, t1.id) AS prev_odometer
                        FROM Truck_car_mileage t1
                        JOIN employees t2 ON t1.emp_id = t2.id_emp
                    ),
                    MileageCalc AS (
                        SELECT *,
                            CASE
                                WHEN status = N'รีเซ็ต' THEN odometer
                                WHEN status = N'ย้อนกลับ' THEN 0
                                WHEN rn = 1 THEN odometer
                                WHEN odometer >= prev_odometer AND status = N'ปกติ' THEN odometer - prev_odometer
                                ELSE odometer
                            END AS distance
                        FROM MileageOrdered
                    ),
                    MileageWithTotal AS (
                        SELECT
                            id,
                            reg_id,
                            emp_id,
                            recorded_date,
                            odometer,
                            status,
                            fname,
                            lname,
                            distance,
                            SUM(distance) OVER (
                                PARTITION BY reg_id
                                ORDER BY recorded_date, id
                                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                            ) AS total_distance
                        FROM MileageCalc
                    ),
                    MileageLatest AS (
                        SELECT *
                        FROM (
                            SELECT
                                reg_id,
                                total_distance,
                                ROW_NUMBER() OVER (PARTITION BY reg_id ORDER BY recorded_date DESC, id DESC) AS rn
                            FROM MileageWithTotal
                        ) t
                        WHERE rn = 1
                    ),
                    LastPMByItem AS (
                        SELECT 
                            r.reg_id,
                            p.item_id,
                            MAX(r.car_mileage) AS last_pm_mileage
                        FROM Truck_repair_quotation_parts p
                        INNER JOIN Truck_repair_garage_quotation q ON p.quotation_id = q.quotation_id
                        INNER JOIN Truck_repair_analysis a ON a.analysis_id = q.analysis_id
                        INNER JOIN Truck_repair_requests r ON r.request_id = a.request_id
                        INNER JOIN Truck_repair_approver app ON app.request_id = r.request_id
                        WHERE p.maintenance_type = 'PM'
                          AND p.approval_checked = 'true'
                          AND p.item_id != 0
                          AND app.approval_status = N'อนุมัติ'
                        GROUP BY r.reg_id, p.item_id
                    ),
                    PMStatus AS (
                        SELECT 
                            v.reg_id,
                            v.reg_number,
                            m.total_distance,
                            it.item_id,
                            it.item_name,
                            d.distance_km,
                            ISNULL(d.distance_km - LAG(d.distance_km) OVER (
                                PARTITION BY v.reg_id, it.item_name
                                ORDER BY d.distance_km
                            ), d.distance_km) AS interval_from_prev,
                            ISNULL(lp.last_pm_mileage, 0) AS last_pm_mileage,
                            (m.total_distance - ISNULL(lp.last_pm_mileage,0)) AS distance_since_pm,
                            CASE 
                                WHEN (m.total_distance - ISNULL(lp.last_pm_mileage,0)) >= d.distance_km THEN N'ถึงเวลา PM'
                                WHEN (m.total_distance - ISNULL(lp.last_pm_mileage,0)) >= d.distance_km - 100 THEN N'ใกล้ถึงเวลา PM'
                                ELSE N'ยังไม่ถึง'
                            END AS pm_status,
                            CASE 
                                WHEN lp.last_pm_mileage IS NULL THEN N'ยังไม่ได้ซ่อม'
                                ELSE N'ซ่อมแล้ว'
                            END AS repair_status
                        FROM Truck_vehicle_registration v
                        LEFT JOIN MileageLatest m ON m.reg_id = v.reg_id
                        INNER JOIN Truck_vehicle_models vm ON vm.model_id = v.model_id
                        LEFT JOIN Truck_maintenance_plan p1 ON p1.model_id = vm.model_id AND p1.is_active = 'true'
                        LEFT JOIN Truck_maintenance_items it ON it.item_id = p1.item_id
                        LEFT JOIN Truck_maintenance_distances d ON d.distance_id = p1.distance_id
                        LEFT JOIN LastPMByItem lp ON lp.reg_id = v.reg_id AND lp.item_id = it.item_id
                    )
                    SELECT *
                    FROM PMStatus
                    WHERE pm_status IN (N'ถึงเวลา PM', N'ใกล้ถึงเวลา PM')
                    ORDER BY reg_id, item_name, distance_km ASC;
                            `;

            const result = await executeSelectQuery(query);

            console.log("Query result:", result);

            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error("An error occurred in displaying data.:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred in displaying data.",
                error: error.message
            });
        }
    },


    cm_pm_mainternance_select_all: async (req, res) => {
        try {

            const { id } = req.params;
            const query = `
                SELECT
                p.quotation_parts_id,
                p.quotation_id,
                p.part_id,
                p.part_name,
                p.maintenance_type,
                p.part_price,
                p.part_unit,
                p.part_qty,
                p.part_discount,
                p.is_approved_part,
                p.part_vat,
                p.approval_checked,
                p.item_id,
                q.quotation_date,
                q.is_selected,
                a.analysis_id,
                r.request_id,
                r.car_mileage,
                r.request_no,
                re.reg_id,
                re.reg_number,
                app.approval_status
                FROM Truck_repair_quotation_parts p
                LEFT JOIN Truck_repair_garage_quotation q ON p.quotation_id = q.quotation_id
                LEFT JOIN Truck_repair_analysis a ON a.analysis_id = q.analysis_id
                LEFT JOIN Truck_repair_requests r ON r.request_id = a.request_id
                LEFT JOIN Truck_vehicle_registration re ON re.reg_id = r.reg_id
                LEFT JOIN Truck_repair_analysis_approver ap ON ap.analysis_id = a.analysis_id
                LEFT JOIN Truck_repair_approver app ON  app.request_id = r.request_id
                WHERE  re.reg_id = @reg_id AND q.is_selected = 'true'
                ;
            `;

            const result = await executeSelectQuery(query, {reg_id: id});

            // console.log("Query result:", result);

            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error("An error occurred in displaying data.:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred in displaying data.",
                error: error.message
            });
        }
    }
};
