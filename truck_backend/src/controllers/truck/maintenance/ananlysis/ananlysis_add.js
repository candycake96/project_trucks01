const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {

    ananlysis_add: async (req, res) => {

        try {
            const { id } = req.params;
            // log id ที่รับมาจาก URL
            console.log("Received request to add analysis for request ID:", id);

            // log ไฟล์ทั้งหมดที่ถูกอัปโหลดเข้ามา (array ของไฟล์)
            console.log('Received files:', req.files);

            // log body ที่ส่งมาทั้งหมด (object)
            console.log("Received request to add analysis with body:", req.body);

            // --- ส่วนนี้คือการแปลง quotations ที่ส่งมาจาก frontend ---
            // quotations อาจถูกส่งมาเป็น string (json) หรือเป็น array เลย
            let quotations = [];
            if (typeof req.body.quotations === 'string') {
                // ถ้าเป็น string ต้องแปลงเป็น array ด้วย JSON.parse
                quotations = JSON.parse(req.body.quotations);
            } else if (Array.isArray(req.body.quotations)) {
                // ถ้าเป็น array อยู่แล้วก็ใช้ได้เลย
                quotations = req.body.quotations;
            }

            // --- ส่วนนี้คือการ map ไฟล์ quotation_file ไปใส่ใน quotations ตาม index ---
            // ตัวอย่าง fieldname ที่ได้จาก multer: quotations[0][quotation_file]
            req.files
                // filter เฉพาะไฟล์ที่ชื่อ fieldname ตรง pattern นี้เท่านั้น
                .filter(file => file.fieldname.match(/^quotations\[\d+\]\[quotation_file\]$/))
                .forEach(file => {
                    // ดึงเลข index ออกมาจาก fieldname เช่น quotations[0][quotation_file] จะได้ 0
                    const match = file.fieldname.match(/^quotations\[(\d+)\]\[quotation_file\]$/);
                    if (match) {
                        const idx = parseInt(match[1], 10); // แปลงเป็นตัวเลข
                        // ถ้า quotations มี index นี้อยู่จริง
                        if (quotations[idx]) {
                            // ใส่ชื่อไฟล์ (filename) ที่อัปโหลดเข้าไปใน quotations[index].quotation_file
                            quotations[idx].quotation_file = file.filename;
                        }
                    }
                });

            // --- ส่วนนี้คือการบันทึกข้อมูลลงฐานข้อมูล ---
            const sqlAnalysis = `
    INSERT INTO Truck_repair_analysis (
        request_id,
        plan_date,
        remark,
        is_quotation_required,
        analysis_emp_id,
        urgent_repair,
        inhouse_repair,
        send_to_garage,
        is_pm,
        is_cm,
        plan_time
    ) 
    OUTPUT INSERTED.analysis_id
    VALUES (
        @request_id,
        @plan_date,
        @remark,
        @is_quotation_required,
        @analysis_emp_id,
        @urgent_repair,
        @inhouse_repair,
        @send_to_garage,
        @is_pm,
        @is_cm,
        @plan_time
    );
`;
            // สร้าง object สำหรับค่าที่จะถูกบันทึกลงฐานข้อมูล 
            const valuesAnalysis = {
                request_id: id,
                analysis_emp_id: req.body.analysis_emp_id, // ควรมีการส่ง emp_id มาจาก frontend
                quotations: JSON.stringify(quotations), // แปลงเป็น string ก่อนบันทึก
                plan_date: req.body.plan_date || '', // ถ้าไม่มีค่าให้เป็นค่าว่าง
                plan_time: req.body.plan_time ? req.body.plan_time : null, // ถ้าไม่มีค่าให้เป็นค่าว่าง
                remark: req.body.remark || '', // ถ้าไม่มีค่าให้เป็นค่าว่าง
                is_pm: req.body.is_pm || '', // ค่าเริ่มต้นเป็น 0
                is_cm: req.body.is_cm || '', // ค่าเริ่มต้นเป็น 0
                is_quotation_required: req.body.is_quotation_required || '', // ค่าเริ่มต้นเป็น 0
                urgent_repair: req.body.urgent_repair || '', // ค่าเริ่มต้นเป็น 0
                inhouse_repair: req.body.inhouse_repair || '', // ค่าเริ่มต้นเป็น 0
                send_to_garage: req.body.send_to_garage || '', // ค่าเริ่มต้นเป็น 0
            };
            // log ค่าที่จะถูกบันทึกลงฐานข้อมูล
            console.log("ValuesAnalysis to be inserted into database:", valuesAnalysis);
            // เรียกใช้ executeQueryEmployeeAccessDB เพื่อบันทึกข้อมูล
            const result = await executeQueryEmployeeAccessDB(sqlAnalysis, valuesAnalysis);
            const analysis_id = result[0].analysis_id; // ดึง analysis_id ที่ถูกสร้างขึ้นมา

            const sqlQuotations = `
    INSERT INTO Truck_repair_garage_quotation (
        analysis_id,
        vendor_id,
        quotation_file,
        quotation_date,
        quotation_vat,
        note,
        is_selected,
        vendor_name
    ) 
    OUTPUT INSERTED.quotation_id
    VALUES (
        @analysis_id,
        @vendor_id,
        @quotation_file,
        @quotation_date,
        @quotation_vat,
        @note,
        @is_selected,
        @vendor_name
    );
`;

            // สร้าง SQL สำหรับบันทึก parts ของ quotation
            const sqlParts = `
                INSERT INTO Truck_repair_quotation_parts (
                    item_id,
                    quotation_id,
                    part_id,
                    part_name,
                    maintenance_type,
                    part_price,
                    part_vat,
                    part_unit,
                    part_qty
                ) VALUES (
                    @item_id,
                    @quotation_id,
                    @part_id,
                    @part_name,
                    @maintenance_type,
                    @part_price,
                    @part_vat,
                    @part_unit,
                    @part_qty
                );
            `;


            // วนลูปบันทึก quotations แต่ละรายการ
            for (const quotation of quotations) {
                const valuesQuotation = {
                    analysis_id: analysis_id, // ใช้ analysis_id ที่ได้จากการบันทึก analysis
                    vendor_id: quotation.vendor_id || '',   //
                    quotation_file: quotation.quotation_file || '', // ถ้าไม่มีไฟล์ให้เป็นค่าว่าง
                    quotation_date: quotation.quotation_date || '', //
                    quotation_vat: quotation.quotation_vat || 0, // ถ้าไม่มี VAT ให้เป็น 0
                    note: quotation.note || 0, //
                    is_selected: quotation.is_selected || 0,
                    vendor_name: quotation.vendor_name || '',
                    // quotation_name: quotation.quotation_name || '', // ถ้าไม่มีชื่อให้เป็นค่าว่าง
                };
                // log ค่าที่จะถูกบันทึกลงฐานข้อมูลสำหรับแต่ละ quotation
                console.log("ValuesQuotation to be inserted into database:", valuesQuotation);
                const resultQuo = await executeQueryEmployeeAccessDB(sqlQuotations, valuesQuotation);
                const quotation_id = resultQuo[0].quotation_id; // ดึง quotation_id ที่ถูกสร้างขึ้นมา
                // log quotation_id ที่ถูกบันทึก 
                console.log("Quotation ID inserted:", quotation_id);
                // ถ้ามี parts ใน quotation นี้ ให้บันทึกลงฐานข้อมูล
                if (quotation.parts && Array.isArray(quotation.parts)) {
                    for (const part of quotation.parts) {
                        const valuesParts = {
                            item_id: part.item_id || '',
                            quotation_id: quotation_id, // ใช้ quotation_id ที่ได้จากการบันทึก
                            part_id: part.part_id || '', // ถ้าไม่มี part_id ให้เป็นค่าว่าง
                            part_name: part.part_name || '', // ถ้าไม่มีชื่ออะไหล่ให้เป็นค่าว่าง
                            maintenance_type: part.maintenance_type || '',
                            part_price: part.price || 0, // ถ้าไม่มีราคาอะไหล่ให้เป็น 0
                            part_vat: part.vat || 0, // ถ้าไม่มี VAT ให้เป็น 0
                            part_unit: part.unit || '', // ถ้าไม่มีหน่วยให้เป็นค่าว่าง
                            part_qty: part.qty || 0 , 
                        };
                        // log ค่าที่จะถูกบันทึกลงฐานข้อมูลสำหรับแต่ละ part 
                        console.log("ValuesParts to be inserted into database:", valuesParts);
                        await executeQueryEmployeeAccessDB(sqlParts, valuesParts);
                    }
                }

            }

            const sqlRQ = `UPDATE Truck_repair_requests SET status = @status WHERE  request_id = @request_id`;
            const valueRQ = { status: "วิเคราะห์แผนกซ่อมบำรุง", request_id: id };
            await executeQueryEmployeeAccessDB(sqlRQ, valueRQ);

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
                action: 'วิเคราะห์แผนกซ่อมบำรุง',
                action_by: req.body.analysis_emp_id,
                action_by_role: 'แผนกช่าง ',
                status: 'วิเคราะห์แผนกซ่อมบำรุง',
                remarks: 'วิเคราะห์แผนกซ่อมบำรุง'
            };

            await executeQueryEmployeeAccessDB(sqlLog, valueLog);

            res.status(200).json({
                message: 'Analysis added successfully',
                quotations
            });

        } catch (error) {
            // ถ้ามี error จะ log และส่ง error กลับไป
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

}



