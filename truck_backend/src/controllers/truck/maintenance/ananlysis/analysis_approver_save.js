const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    // อนุมัติบันทึก ส่งต่อเพื่อให้ผู้จัดการอนุมัติ
    analysis_approver_save: async (req, res) => {
        try {
            const { approver, quotations } = req.body;
            const { id } = req.params;

            // ดึง analysis_id จาก request_id
            const analysisRow = await executeQueryEmployeeAccessDB(
                `SELECT analysis_id FROM Truck_repair_analysis WHERE request_id = @request_id`,
                { request_id: approver.request_id }
            );
            if (!analysisRow || analysisRow.length === 0) {
                return res.status(400).json({ message: "ไม่พบข้อมูล analysis_id สำหรับ request_id นี้" });
            }
            const analysis_id = analysisRow[0].analysis_id;

            // 1. INSERT ข้อมูล approver
            const sqlApprover = `
                INSERT INTO Truck_repair_analysis_approver (
                    analysis_id,
                    approver_emp_id,
                    approver_name,
                    approval_status,
                    approval_date,
                    remark
                ) VALUES (
                    @analysis_id,
                    @approver_emp_id,
                    @approver_name,
                    @approval_status,
                    @approval_date,
                    @remark
                )
            `;
            await executeQueryEmployeeAccessDB(sqlApprover, {
                analysis_id: analysis_id,
                approver_emp_id: id,
                approver_name: approver.approver_name,
                approval_status: approver.approval_status || '',
                approval_date: new Date(),
                remark: approver.remark || ''
            });

            // ... (ส่วน update parts ตามเดิม) ...
            if (Array.isArray(quotations)) {
                for (const quotation of quotations) {
                    if (Array.isArray(quotation.parts)) {
                        for (const part of quotation.parts) {
                            await executeQueryEmployeeAccessDB(
                                `UPDATE Truck_repair_quotation_parts SET 
                        is_approved_part = @is_approved_part,
                        approval_checked = @approval_checked
                    WHERE quotation_parts_id = @quotation_parts_id`,
                                {
                                    quotation_parts_id: Number(part.quotation_parts_id),
                                    is_approved_part: part.is_approved_part ? 1 : 0,
                                    approval_checked: 1
                                }
                            );
                        }
                    }
                }
            }

            // กำหนดค่า status ตามเงื่อนไข
            let status = '';

            if (approver.approval_status === 'approved') {
                status = 'อนุมัติตรวจเช็ครถ';
            } else if (approver.approval_status === 'rejected') {
                status = 'รอแก้ไขผลตรวจเช็ครถ';
            } else {
                status = 'รอแก้ไขผลตรวจเช็ครถ';
            }



            const sqlRQ = `UPDATE Truck_repair_requests SET status = @status WHERE  request_id = @request_id`;
            const valueRQ = { status: status, request_id: approver.request_id };
            await executeQueryEmployeeAccessDB(sqlRQ, valueRQ);

            // บันทึก log
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
                request_id: approver.request_id,
                action: 'หัวหน้าแผนกช่าง',
                action_by: id,
                action_by_role: 'หัวหน้าแผนกช่าง',
                status: status,
                remarks: 'อนุมัติ/ไม่อนุมัติ/ส่งกลับแก้ไข'
            };

            await executeQueryEmployeeAccessDB(sqlLog, valueLog);

            res.status(200).json({ message: "บันทึกข้อมูลอนุมัติและอะไหล่สำเร็จ" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error saving approver/parts", error: error.message });
        }
    },

    // แก้ไขการอนุมัติ เพื่อกดบันทึกข้อมูล
    analysis_approver_edit: async (req, res) => {
        try {
            const { approver, quotations } = req.body;
            const { id } = req.params;
            console.log('id : ', id);
            console.log('approver : ', approver);
            console.log('quotations : ', JSON.stringify(quotations, null, 2));

            // 1. INSERT ข้อมูล approver
            if (approver && approver.approver_emp_id) {
                await executeQueryEmployeeAccessDB(
                    `UPDATE Truck_repair_analysis_approver SET
                    approval_status = @approval_status,
                    approval_date = @approval_date,
                    remark = @remark
                 WHERE analysis_id = @analysis_id AND approver_emp_id = @approver_emp_id`,
                    {
                        analysis_id: approver.analysis_id,
                        approver_emp_id: approver.approver_emp_id,
                        approval_status: approver.approval_status || '',
                        approval_date: new Date(),
                        remark: approver.remark || ''
                    }
                );
            }
            // ... (ส่วน update parts ตามเดิม) ...
            if (Array.isArray(quotations)) {
                for (const quotation of quotations) {
                    if (Array.isArray(quotation.parts)) {
                        for (const part of quotation.parts) {
                            await executeQueryEmployeeAccessDB(
                                `UPDATE Truck_repair_quotation_parts SET 
                        is_approved_part = @is_approved_part,
                        approval_checked = @approval_checked
                    WHERE quotation_parts_id = @quotation_parts_id`,
                                {
                                    quotation_parts_id: Number(part.quotation_parts_id),
                                    is_approved_part: part.is_approved_part ? 1 : 0,
                                    approval_checked: 1
                                }
                            );
                        }
                    }
                }
            }

                        // กำหนดค่า status ตามเงื่อนไข
            let status = '';

            if (approver.approval_status === 'approved') {
                status = 'ผ่านอนุมัตผลตรวจหัวหน้าแผนกช่าง';
            } else if (approver.approval_status === 'rejected') {
                status = 'ไม่ผ่านอนุมัตผลตรวจหัวหน้าแผนกช่าง';
            } else {
                status = 'ส่งแก้ไขผลตรวจ';
            }


            const sqlRQ = `UPDATE Truck_repair_requests SET status = @status WHERE  request_id = @request_id`;
            const valueRQ = { status: status, request_id: approver.request_id };
            await executeQueryEmployeeAccessDB(sqlRQ, valueRQ);

            // บันทึก log
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
                request_id: approver.request_id,
                action: 'หัวหน้าแผนกช่าง',
                action_by:  id,
                action_by_role: 'หัวหน้าแผนกช่าง',
                status: status,
                remarks: 'อนุมัติ/ไม่อนุมัติ/ส่งกลับแก้ไข'
            };

            await executeQueryEmployeeAccessDB(sqlLog, valueLog);

            res.status(200).json({ message: "บันทึกข้อมูลอนุมัติและอะไหล่สำเร็จ" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error saving approver/parts", error: error.message });
        }
    },




};