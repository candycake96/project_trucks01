const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    repair_requests_add: async (req, res) => {
        const { emp_id, request_date, odometer, reg_number, parts } = req.body;

        try {
            if (
                !reg_number ||
                !emp_id ||
                !odometer ||
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
            const requestDate = request_date ? new Date(request_date) : new Date();
            const formattedDate = requestDate.toISOString().split("T")[0];

            const sqlSetting = `
                SELECT 
                doc_set_id,
                doc_set_type,
                doc_set_prefix,
                date_part,
                seq_number,
                reset_type,
                created_at,
                updated_at
                    FROM document_headers_settings 
                WHERE doc_set_id = 1
            `;
            const resultSetting = await executeQueryEmployeeAccessDB(sqlSetting);
            if (!resultSetting || resultSetting.length === 0) {
                return res.status(404).json({ message: "ไม่พบการตั้งค่าเลขเอกสาร" });
            }

            const {
                doc_set_prefix,
                seq_number,
                date_part,
                reset_type
            } = resultSetting[0];

            const formatDatePart = (format, date = new Date()) => {
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();

                const formatted = format
                    .replace(/dd/g, dd)
                    .replace(/mm/g, mm)
                    .replace(/yyyy/g, yyyy);

                // ลบเครื่องหมาย / หรือสัญลักษณ์อื่น ๆ ถ้ามี
                return formatted.replace(/[^\w]/g, ''); // ลบทุกตัวที่ไม่ใช่ a-zA-Z0-9

            };

            const formattedDatePart = formatDatePart(date_part, requestDate); // เช่น 2025/05/22

            const sqlCar = `SELECT reg_id FROM Truck_vehicle_registration WHERE reg_number = @reg_number`;
            const resultCar = await executeQueryEmployeeAccessDB(sqlCar, { reg_number });

            if (!resultCar || resultCar.length === 0) {
                return res.status(404).json({ message: "ไม่พบทะเบียนรถ" });
            }

            const reg_id = resultCar[0].reg_id;

            let sqlCount = `SELECT COUNT(*) AS count FROM Truck_repair_requests WHERE 1=1 `;
            const countParams = {};

            if (reset_type === 'daily') {
                sqlCount += ` AND CONVERT(date, request_date) = @request_date `;
                countParams.request_date = formattedDate;

            } else if (reset_type === 'monthly') {
                sqlCount += ` AND MONTH(request_date) = @month AND YEAR(request_date) = @year `;
                countParams.month = requestDate.getMonth() + 1;
                countParams.year = requestDate.getFullYear();

            } else if (reset_type === 'yearly') {
                sqlCount += ` AND YEAR(request_date) = @year `;
                countParams.year = requestDate.getFullYear();
            }

            // ถ้า reset_type === 'never' ก็ไม่เพิ่มเงื่อนไข (นับทั้งหมด)

            const resultCount = await executeQueryEmployeeAccessDB(sqlCount, countParams);
            const count = resultCount[0].count + 1;


            const runningNumber = String(count).padStart(4, "0");
            const request_no = `${doc_set_prefix}-${formattedDatePart}-${runningNumber}`;


            const sqlInsert = `
                INSERT INTO Truck_repair_requests 
                (request_informer_emp_id, request_no, request_date, status, reg_id, car_mileage) 
                OUTPUT INSERTED.request_id
                VALUES 
                (@emp_id, @request_no, @request_date, @status, @reg_id, @car_mileage)
            `;
            const valueInsert = {
                emp_id: emp_id,
                request_no: request_no,
                request_date: formattedDate,
                status: "แจ้งซ่อม",
                reg_id: reg_id,
                car_mileage: odometer
            };

            const resultInsert = await executeQueryEmployeeAccessDB(sqlInsert, valueInsert);
            const request_id = resultInsert[0].request_id;

            // ✅ วนลูปเพิ่มอะไหล่แต่ละชิ้น (ถ้ามี)
            if (Array.isArray(parts) && parts.length > 0) {
                const sqlParts = `
                    INSERT INTO Truck_repair_parts_used
                    (request_id, part_id, repair_part_name, maintenance_type, repair_part_price, repair_part_unit, repair_part_qty, repair_part_vat, item_id) 
                    VALUES 
                    (@request_id, @part_id, @repair_part_name, @maintenance_type, @repair_part_price, @repair_part_unit, @repair_part_qty, @repair_part_vat, @item_id)
                `;

                for (const part of parts) {
                    const valueParts = {
                        request_id: request_id,
                        part_id: part.part_id,
                        repair_part_name: part.part_name,
                        maintenance_type: part.maintenance_type,
                        repair_part_price: part.price,
                        repair_part_unit: part.unit,
                        repair_part_qty: part.qty,
                        repair_part_vat: part.vat || 0,
                        item_id: part.item_id || '',
                    };
                    await executeQueryEmployeeAccessDB(sqlParts, valueParts);
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
                request_id: request_id,
                action: 'request',
                action_by: emp_id,
                action_by_role: 'พนักงาน',
                status: 'แจ้งซ่อม',
                remarks: ''
            };

            await executeQueryEmployeeAccessDB(sqlLog, valueLog);


            res.status(201).json({ message: "บันทึกสำเร็จ", request_no, request_id });

        } catch (error) {
            console.error("Error in repair_requests_add:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error });
        }
    }
};
