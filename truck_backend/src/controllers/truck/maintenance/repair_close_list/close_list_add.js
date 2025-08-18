const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    close_list_add: async (req, res) => {
        console.log(req.body);
        console.log(req.files);
        try {
            const { id } = req.params;
            const {
                request_id,
                close_date,
                close_remark,
                status_after_close,
            } = req.body;
     
            const dataFile = req.files['close_file'] ? req.files['close_file'][0].filename : null;

            const closed_by = parseInt(id, 10);
            if (isNaN(closed_by)) {
                return res.status(400).json({ message: "รหัสผู้ใช้งานไม่ถูกต้อง" });
            }

            if (!request_id || !close_date || !status_after_close) {
                return res.status(400).json({ message: "กรุณาระบุข้อมูลที่จำเป็นให้ครบถ้วน" });
            }

            const sqlInsert = `
                INSERT INTO Truck_repair_close (    
                    request_id,
                    close_date,
                    close_remark,
                    closed_by,
                    close_file,
                    status_after_close
                ) VALUES (
                    @request_id,
                    @close_date,
                    @close_remark,
                    @closed_by,
                    @close_file,
                    @status_after_close            
                )
            `;

            const result = await executeQueryEmployeeAccessDB(sqlInsert, {
                request_id,
                close_date,
                close_remark,
                closed_by,
                close_file: dataFile || null,
                status_after_close,
            });

                        const sqlRQ = `UPDATE Truck_repair_requests SET status = @status WHERE  request_id = @request_id`;
            const valueRQ = { status: status_after_close, request_id: request_id };
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
                request_id: request_id,
                action: status_after_close,
                action_by: id,
                action_by_role: status_after_close,
                status: status_after_close,
                remarks: status_after_close
            };

            await executeQueryEmployeeAccessDB(sqlLog, valueLog);

            res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", data: result });
        } catch (error) {
            console.error("Error in close_list_add:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },
};
