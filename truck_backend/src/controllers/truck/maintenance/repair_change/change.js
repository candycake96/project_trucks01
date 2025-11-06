const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {

    ///////////////
    // แสดงข้อมูลล่าสุดเท่าสนั้น
    change_show_id: async (req, res) => {
        const { id } = req.params; // id คือ repair_id

        try {
            // ✅ ใช้ parameterized query เพื่อป้องกัน SQL Injection
            const sql = `
            SELECT 
                id,
                repair_id,
                requester_name,
                requester_date,
                requester_remark,
                approver_name,
                approver_date,
                approver_status,
                approver_remark,
                created_at
            FROM Truck_repair_change_requests
            WHERE id = @id
        `;

            // ✅ ส่งพารามิเตอร์เป็นอาร์เรย์ เพื่อให้ DB Driver จัดการการ bind ค่าอย่างปลอดภัย
            const result = await executeQueryEmployeeAccessDB(sql, { id: id });

            if (!result || result.length === 0) {
                return res.status(404).json({
                    message: "ไม่พบข้อมูลคำขอแก้ไขสำหรับใบแจ้งซ่อมนี้"
                });
            }

            res.status(200).json({
                message: "ดึงข้อมูลคำขอแก้ไขสำเร็จ",
                data: result[0] // ✅ ส่งเฉพาะเรคคอร์ดที่เจอ
            });

        } catch (error) {
            console.error("❌ Error in change_show_id:", error);
            res.status(500).json({
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: error.message
            });
        }
    },


    ///////////////////////////////
    ////////////////////////////////////////////////////////////////
    // แสดงข้อมูลล่าสุดเท่าสนั้น
    change_show_top: async (req, res) => {
        const { id } = req.params; // id คือ repair_id

        try {
            const sql = `
            SELECT TOP 1
                id,
                repair_id,
                requester_name,
                requester_date,
                requester_remark,
                approver_name,
                approver_date,
                approver_status,
                approver_remark,
                created_at
            FROM Truck_repair_change_requests
            WHERE repair_id = @repair_id
            ORDER BY created_at DESC
        `;

            const result = await executeQueryEmployeeAccessDB(sql, { repair_id: id });

            if (result.length === 0) {
                return res.status(404).json({ message: "ไม่พบข้อมูลคำขอแก้ไขสำหรับใบแจ้งซ่อมนี้" });
            }

            res.status(200).json({
                message: "ดึงข้อมูลคำขอแก้ไขล่าสุดสำเร็จ",
                data: result[0] // ส่งเฉพาะเรคคอร์ดล่าสุด
            });

        } catch (error) {
            console.error("Error in change_show_top:", error);
            res.status(500).json({
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: error.message
            });
        }
    },


    // แสดงข้อมูลคำขอแก้ไข (ตาม repair_id)
    change_show: async (req, res) => {
        const { id } = req.params; // id คือ repair_id

        try {
            const sql = `
            SELECT 
                id,
                repair_id,
                requester_name,
                requester_date,
                requester_remark,
                approver_name,
                approver_date,
                approver_status,
                approver_remark,
                created_at
            FROM Truck_repair_change_requests
            WHERE repair_id = @repair_id
            ORDER BY created_at DESC
        `;

            const result = await executeQueryEmployeeAccessDB(sql, { repair_id: id });

            if (result.length === 0) {
                return res.status(404).json({ message: "ไม่พบข้อมูลคำขอแก้ไขสำหรับใบแจ้งซ่อมนี้" });
            }

            res.status(200).json({
                message: "ดึงข้อมูลคำขอแก้ไขสำเร็จ",
                data: result
            });

        } catch (error) {
            console.error("Error in change_show:", error);
            res.status(500).json({
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: error.message
            });
        }
    },


    // เพิ่มคำขอแก้ไขใบแจ้งซ่อม
    change_add: async (req, res) => {
        try {
            const { requester_name, requester_date, requester_remark } = req.body;
            const { id } = req.params;

            // ✅ ตรวจสอบค่าที่จำเป็น
            if (!id || !requester_name) {
                return res.status(400).json({ message: "กรุณาระบุข้อมูลให้ครบถ้วน" });
            }

            // ✅ เพิ่มข้อมูลคำขอแก้ไข
            const sqlInsert = `
            INSERT INTO Truck_repair_change_requests 
            (repair_id, requester_name, requester_date, requester_remark)
            VALUES (@repair_id, @requester_name, @requester_date, @requester_remark)
        `;

            const result = await executeQueryEmployeeAccessDB(sqlInsert, {
                repair_id: id,
                requester_name,
                requester_date: requester_date || new Date(), // ถ้าไม่มีวันให้ใช้วันปัจจุบัน
                requester_remark: requester_remark || null,
            });

            // ✅ อัปเดตสถานะในตารางหลัก
            const newStatus = "รอคำขอแก้ไขหลังอนุมัติ";
            const sqlRequest = `
            UPDATE Truck_repair_requests
            SET status = @status
            WHERE request_id = @request_id
        `;

            await executeQueryEmployeeAccessDB(sqlRequest, {
                status: newStatus,
                request_id: id,
            });

            res.status(200).json({
                message: "บันทึกข้อมูลคำขอสำเร็จ",
                data: result,
            });
        } catch (error) {
            console.error("❌ Error in change_add:", error);
            res.status(500).json({
                message: "เกิดข้อผิดพลาด",
                error: error.message,
            });
        }
    },

    ////////////////////////////////////////////////////////////////////////
    // อนุมัติ / ไม่อนุมัติคำขอ
    change_approval: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                approver_emp_id,
                approver_name,
                approver_date,
                approver_status,
                approver_remark,
                request_id
            } = req.body;

            console.log('body :', req.body);

            // ✅ ตรวจสอบข้อมูลเบื้องต้น
            if (!id || !approver_name || !approver_status || !request_id) {
                return res.status(400).json({
                    message: "กรุณาระบุข้อมูลผู้อนุมัติให้ครบถ้วน"
                });
            }

            // ✅ อัปเดตตารางคำขอแก้ไข
            const sqlUpdateChange = `
            UPDATE Truck_repair_change_requests
            SET 
                approver_name = @approver_name,
                approver_date = @approver_date,
                approver_status = @approver_status,
                approver_remark = @approver_remark
            WHERE id = @id
        `;

            await executeQueryEmployeeAccessDB(sqlUpdateChange, {
                approver_name,
                approver_date: approver_date || new Date(),
                approver_status,
                approver_remark: approver_remark || null,
                id
            });

            // ✅ สร้างสถานะใหม่สำหรับตารางหลัก
            const newStatus =
                approver_status === "approved"
                    ? "ผ่านการอนุมัติเพื่อแก้ไข"
                    : "คำขอแก้ไขถูกปฏิเสธ";

            const sqlUpdateMain = `
            UPDATE Truck_repair_requests
            SET status = @status                           
            WHERE request_id = @request_id
        `;

            console.log("✅ approver_status:", approver_status);
            console.log("✅ newStatus:", newStatus);

            await executeQueryEmployeeAccessDB(sqlUpdateMain, {
                status: newStatus,
                request_id: request_id
            });


            // ✅ อัปเดตสถานะผู้อนุมัติ
            const sqlUpdateApprover = `
            UPDATE Truck_repair_approver
            SET approval_status = @approval_status
            WHERE request_id = @request_id
        `;

        
            // ✅ อัปเดตสถานะผู้อนุมัติ (เฉพาะตอนอนุมัติเท่านั้น)
            if (approver_status === "approved") {
                await executeQueryEmployeeAccessDB(sqlUpdateApprover, {
                    request_id: request_id,
                    approval_status: "รอแก้ไข",
                });


            }


            // ✅ ตอบกลับสำเร็จ
            res.status(200).json({
                message: "อัปเดตสถานะการอนุมัติสำเร็จ",
                status: newStatus
            });

        } catch (error) {
            console.error("❌ Error in change_approval:", error);
            res.status(500).json({
                message: "เกิดข้อผิดพลาดในการอัปเดตสถานะ",
                error: error.message
            });
        }
    }



};
