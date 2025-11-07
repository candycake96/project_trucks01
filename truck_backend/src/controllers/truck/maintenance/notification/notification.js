const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    quotation_show_analysis_id: async (req, res) => {
        try {

            const {id} = req.params;
            
            const sqlInsert = `INSERT INTO emp_notifications (
                type,
                related_id,
                sender_emp_id,
                receiver_emp_id,
                message,
                link,
                is_read
            ) VALUES (
                @type,
                @related_id,
                @sender_emp_id,
                @receiver_emp_id,
                @message,
                @link,
                @is_read             
            )`;

        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    }
};



