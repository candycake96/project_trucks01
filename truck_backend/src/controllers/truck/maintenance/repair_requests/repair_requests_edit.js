const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    repair_requests_edit: async (req, res) => {
        const { id } = req.params;
        const { car_mileage, reg_number, parts, request_informer_emp_id } = req.body;
        console.log('test : ', id);
        console.log('reg_number : ', reg_number);
        console.log('car_mileage : ', car_mileage);
        console.log('request_informer_emp_id : ', request_informer_emp_id);
        console.log('parts : ', parts);
        try {
            if (
                !id ||
                !reg_number ||
                !car_mileage ||
                !Array.isArray(parts) ||
                parts.length === 0 ||
                !parts.every(part =>
                    part.part_id &&
                    part.part_name &&
                    part.maintenance_type &&
                    part.price != null &&
                    part.unit &&
                    part.qty != null
                )
            ) {
                return res.status(400).json({ message: "กรุณาระบุข้อมูลอะไหล่ให้ครบถ้วน" });
            }

            const sqlCar = `SELECT reg_id FROM Truck_vehicle_registration WHERE reg_number = @reg_number`;
            const resultCar = await executeQueryEmployeeAccessDB(sqlCar, { reg_number });

            if (!resultCar || resultCar.length === 0) {
                return res.status(404).json({ message: "ไม่พบทะเบียนรถ" });
            }

            const reg_id = resultCar[0].reg_id;

            const sqlRequest = `UPDATE Truck_repair_requests SET 
                reg_id = @reg_id,
                request_informer_emp_id = @request_informer_emp_id, 
                car_mileage = @car_mileage
                WHERE request_id = @request_id`;

            const valueRequest = {
                reg_id,
                request_informer_emp_id,
                car_mileage: car_mileage,
                request_id: id
            };

            await executeQueryEmployeeAccessDB(sqlRequest, valueRequest);

            // 1. ดึง parts_used_id ทั้งหมดจาก DB 
            const sqlOldParts = `
                            SELECT parts_used_id FROM Truck_repair_parts_used WHERE request_id = @request_id
                            `;
            const oldParts = await executeQueryEmployeeAccessDB(sqlOldParts, { request_id: id });

            // 2. เอาเฉพาะ parts ที่ส่งมาจากฟรอนต์ที่มี parts_used_id (คือของเดิม)
            const incomingPartIds = new Set(
                parts.filter(p => p.parts_used_id).map(p => p.parts_used_id)
            );

            // 3. เปรียบเทียบว่า oldParts ตัวไหนไม่มีใน incomingPartIds → ต้องลบ
            const partsToDelete = oldParts
                .filter(old => !incomingPartIds.has(old.parts_used_id))
                .map(old => old.parts_used_id);

                // 4. ลบอะไหล่ที่ไม่ถูกส่งมา (แสดงว่าผู้ใช้ลบจากฟอร์มแล้ว)
            for (const parts_used_id of partsToDelete) {
                await executeQueryEmployeeAccessDB(
                    `DELETE FROM Truck_repair_parts_used WHERE parts_used_id = @parts_used_id`,
                    { parts_used_id }
                );
            }


            if (Array.isArray(parts) && parts.length > 0) {
                const sqlPartsUp = `UPDATE Truck_repair_parts_used SET
                    part_id = @part_id, 
                    // item_id = @item_id,
                    repair_part_name = @repair_part_name, 
                    maintenance_type = @maintenance_type, 
                    repair_part_price = @repair_part_price, 
                    repair_part_unit = @repair_part_unit, 
                    repair_part_qty = @repair_part_qty, 
                    repair_part_vat = @repair_part_vat
                    WHERE parts_used_id = @parts_used_id
                `;

                const sqlPartsIn = `
                    INSERT INTO Truck_repair_parts_used
                    ( request_id, part_id, repair_part_name, maintenance_type, repair_part_price, repair_part_unit, repair_part_qty, repair_part_vat) 
                    VALUES 
                    ( @request_id, @part_id, @repair_part_name, @maintenance_type, @repair_part_price, @repair_part_unit, @repair_part_qty, @repair_part_vat)
                `;

                const sqlPartDe = `
                     DELETE FROM Truck_repair_parts_used WHERE parts_used_id = @parts_used_id
                `;


                for (const part of parts) {
                    const valueParts = {
                        // item_id: part.item_id,
                        part_id: part.part_id,
                        repair_part_name: part.part_name,
                        maintenance_type: part.maintenance_type,
                        repair_part_price: part.price,
                        repair_part_unit: part.unit,
                        repair_part_qty: part.qty,
                        repair_part_vat: part.vat || 0
                    };

                    if (part.parts_used_id) {
                        await executeQueryEmployeeAccessDB(sqlPartsUp, { ...valueParts, parts_used_id: part.parts_used_id, request_id: part.request_id });
                    } else {
                        await executeQueryEmployeeAccessDB(sqlPartsIn, { ...valueParts, request_id: id, });
                    }
                }


            }

                        const sqlLog = `INSERT INTO Truck_repair_logs ( 
                                request_id,
                                action,
                                action_by,
                                action_by_role,
                                status,
                                remarks
                            ) VALUES (
                                @request_id,
                                @action,
                                @action_by,
                                @action_by_role,
                                @status,
                                @remarks
                            )`;

            const valueLog = {
                request_id: id,
                action: 'แจ้งซ่อม',
                action_by: request_informer_emp_id,
                action_by_role: 'พนักงาน',
                status: 'แจ้งซ่อม',
                remarks: 'ผ่านการแก้ไข'
            };

            await executeQueryEmployeeAccessDB(sqlLog, valueLog);

            res.status(201).json({ message: "บันทึกสำเร็จ", request_id: id });

        } catch (error) {
            console.error("Error in repair_requests_edit:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error });
        }
    }
};
