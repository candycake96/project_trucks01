const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    setting_doc_repair: async (req, res) => {
        try {

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

            const result = await executeQueryEmployeeAccessDB(sqlSetting);
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "ไม่สามารถบันทึกข้อมูลได้" })
            }

        } catch (error) {
            console.error("Error in repair_requests_add:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },

    setting_doc_repair_update: async (req, res) => {
        try {
            const {doc_set_prefix, seq_number, date_part, reset_type} = req.body;

            const sqlSetting = ` UPDATE document_headers_settings SET 
            doc_set_prefix = @doc_set_prefix,
            seq_number = @seq_number,
            date_part = @date_part,
            reset_type = @reset_type
                WHERE doc_set_id = 1
            `;

            const value = {
                doc_set_prefix: doc_set_prefix,
                seq_number: seq_number,
                date_part: date_part,
                reset_type: reset_type
            };
            const result = await executeQueryEmployeeAccessDB(sqlSetting, value);

        if (result && result.affectedRows > 0) {
            res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ" });
        } else {
            res.status(404).json({ message: "ไม่สามารถบันทึกข้อมูลได้หรือไม่มีข้อมูลเปลี่ยนแปลง" });
        }

    } catch (error) {
        console.error("Error in setting_doc_repair_update:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
    },


     setting_doc_repair_invoice: async (req, res) => {
        try {

            const sqlSetting = `
                SELECT 
                doc_set_id,
                doc_set_type,
                doc_set_prefix,
                date_part,
                seq_number,
                reset_type,
                created_at,
                updated_at,
                doc_order
                    FROM document_headers_settings 
                WHERE doc_set_id = 2
            `;

            const result = await executeQueryEmployeeAccessDB(sqlSetting);
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "ไม่สามารถบันทึกข้อมูลได้" })
            }

        } catch (error) {
            console.error("Error in repair_requests_add:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },

        setting_doc_repair_invoice_update: async (req, res) => {
        try {
            const { doc_set_prefix, seq_number, date_part, reset_type, order } = req.body;

            const sqlSetting = ` UPDATE document_headers_settings SET 
            doc_set_prefix = @doc_set_prefix,
            seq_number = @seq_number,
            date_part = @date_part,
            reset_type = @reset_type,
            doc_order = @doc_order
                WHERE doc_set_id = 2
            `;

            const value = {
                doc_set_prefix: doc_set_prefix,
                seq_number: seq_number,
                date_part: date_part,
                reset_type: reset_type,
                doc_order: order
            };
            const result = await executeQueryEmployeeAccessDB(sqlSetting, value);

        if (result && result.affectedRows > 0) {
            res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ" });
        } else {
            res.status(404).json({ message: "ไม่สามารถบันทึกข้อมูลได้หรือไม่มีข้อมูลเปลี่ยนแปลง" });
        }

    } catch (error) {
        console.error("Error in setting_doc_repair_update:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
    }
};
