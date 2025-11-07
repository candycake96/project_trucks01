const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    approval_update: async (req, res) => {
        try {
            const {
                request_id,
                approver_emp_id,
                approver_name,
                approval_status,
                approval_date,
                remark,
                analysis_emp_id // เพิ่มไว้ให้ตรงกับ log
            } = req.body;
            const { id } = req.params;

            // ✅ 1. อัปเดตข้อมูลผู้อนุมัติ
            const sqlUpdateApprover = `
                UPDATE Truck_repair_approver
                SET 
                    approver_emp_id = @approver_emp_id,
                    approver_name = @approver_name,
                    approval_status = @approval_status,
                    approval_date = @approval_date,
                    remark = @remark
                WHERE approver_id = @approver_id
            `;

            await executeQueryEmployeeAccessDB(sqlUpdateApprover, {
                approver_id: id,
                approver_emp_id,
                approver_name,
                approval_status,
                approval_date,
                remark
            });


            const sqlRQ = `UPDATE Truck_repair_requests SET status = @status WHERE  request_id = @request_id`;
            const valueRQ = { status: "ผู้จัดการอนุมัติ", request_id: request_id };
            await executeQueryEmployeeAccessDB(sqlRQ, valueRQ);

            // ✅ 2. อัปเดตสถานะในตารางคำขอ
            const sqlUpdateRequest = `
                UPDATE Truck_repair_requests 
                SET status = @status 
                WHERE request_id = @request_id
            `;

            const valueUpdateRequest = {
                status: "ผู้จัดการอนุมัติ",
                request_id
            };

            await executeQueryEmployeeAccessDB(sqlUpdateRequest, valueUpdateRequest);

            // ✅ 3. บันทึก Log การดำเนินการ
            const sqlInsertLog = `
                INSERT INTO Truck_repair_logs (
                    request_id,
                    action,
                    action_by,
                    action_by_role,
                    status,
                    remarks
                )
                VALUES (
                    @request_id,
                    @action,
                    @action_by,
                    @action_by_role,
                    @status,
                    @remarks
                )
            `;

            const valueInsertLog = {
                request_id,
                action: 'ผู้จัดการฝ่ายแก้ไข',
                action_by: analysis_emp_id || approver_emp_id, // ใช้ emp id ที่มี
                action_by_role: 'ผู้จัดการฝ่าย',
                status: 'ตรวจสอบโดยผู้จัดการฝ่าย',
                remarks: 'แก้ไขจากผู้จัดการ'
            };

            await executeQueryEmployeeAccessDB(sqlInsertLog, valueInsertLog);

            // ✅ ส่งผลลัพธ์กลับ
            res.status(200).json({ message: "บันทึกข้อมูลอนุมัติสำเร็จ" });
        } catch (error) {
            console.error("❌ Error updating approval data:", error);
            res.status(500).json({
                message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
                error: error.message
            });
        }
    }
};
