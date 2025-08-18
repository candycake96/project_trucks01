const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

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

            const sql = `INSERT INTO Truck_repair_approver (
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

            await executeQueryEmployeeAccessDB(sql, {
                request_id,
                approver_emp_id: id,
                approver_name,
                approval_status,
                approval_date,
                remark
            });

            const sqlRQ = `UPDATE Truck_repair_requests SET status = @status WHERE  request_id = @request_id`;
            const valueRQ = { status: "ผู้จัดการฝ่ายขนส่งและคลังสินค้า", request_id: request_id };
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
                action: 'ผู้จัดการฝ่ายแก้ไข',
                action_by: req.body.analysis_emp_id,
                action_by_role: 'ผู้จัดการฝ่าย ',
                status: 'ตรวจสอบโดยผู้จัดการฝ่าย',
                remarks: 'แก้ไขจากผู้จัดการ'
            };

            await executeQueryEmployeeAccessDB(sqlLog, valueLog);

            res.status(200).json({ message: "บันทึกข้อมูลอนุมัติสำเร็จ" });
        } catch (error) {
            console.error("❌ Error inserting approval data:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", error: error.message });
        }
    }
};

