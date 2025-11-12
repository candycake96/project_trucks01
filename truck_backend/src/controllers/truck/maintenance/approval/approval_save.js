const { executeQueryEmployeeAccessDB } = require('../../../../config/db');
const sql = require('mssql');

module.exports = {
    approval_save: async (req, res) => {
        try {
            const {
                request_id,
                approver_name,
                approval_status,
                approval_date,
                remark,
            } = req.body;
            const { id } = req.params;

            const sqlInsert = `
                INSERT INTO Truck_repair_approver (
                    request_id,
                    approver_emp_id,
                    approver_name,
                    approval_status,
                    approval_date,
                    remark
                ) VALUES (
                    @request_id,
                    @approver_emp_id,
                    @approver_name,
                    @approval_status,
                    @approval_date,
                    @remark
                )`;

            const paramsInsert = {
                request_id: { type: sql.Int, value: Number(request_id) },
                approver_emp_id: { type: sql.Int, value: Number(id) },
                approver_name: { type: sql.NVarChar, value: approver_name || "" },
                approval_status: { type: sql.NVarChar, value: approval_status || "" },
                approval_date: { type: sql.NVarChar, value: approval_date || "" }, // หรือ sql.DateTime ถ้า column เป็น DateTime
                remark: { type: sql.NVarChar, value: remark || "" },
            };

            await executeQueryEmployeeAccessDB(sqlInsert, paramsInsert);

            // --- Update request status ---
            const sqlRQ = `UPDATE Truck_repair_requests SET status = @status WHERE request_id = @request_id`;
            const valueRQ = {
                status: { type: sql.NVarChar, value: "ผู้จัดการอนุมัติ" },
                request_id: { type: sql.Int, value: Number(request_id) },
            };
            await executeQueryEmployeeAccessDB(sqlRQ, valueRQ);

            // --- Insert log ---
            const sqlLog = `
                INSERT INTO Truck_repair_logs ( 
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
                request_id: { type: sql.Int, value: Number(request_id) },
                action: { type: sql.NVarChar, value: 'ผู้จัดการฝ่ายแก้ไข' },
                action_by: { type: sql.Int, value: Number(id) },
                action_by_role: { type: sql.NVarChar, value: 'ผู้จัดการฝ่าย' },
                status: { type: sql.NVarChar, value: 'ตรวจสอบโดยผู้จัดการฝ่าย' },
                remarks: { type: sql.NVarChar, value: 'แก้ไขจากผู้จัดการ' },
            };

            await executeQueryEmployeeAccessDB(sqlLog, valueLog);

            res.status(200).json({ message: "บันทึกข้อมูลอนุมัติสำเร็จ" });
        } catch (error) {
            console.error("❌ Error inserting approval data:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", error: error.message });
        }
    }
};
