const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    invoice_approval: async (req, res) => {
        try {
            console.log('Data from frontend:', req.body);
            console.log('Params:', req.params);

            const { id } = req.params; // invoice_id
            const {
                invoice_approver_emp_id,
                invoice_approver_status,
                invoice_approver_note,
                invoice_approver_date
            } = req.body;


            // ✅ แปลงสถานะจาก string → bit
            const approvalBit =
                invoice_approver_status === "approved" ? 1 :
                    invoice_approver_status === "rejected" ? 0 : null;

            // 1️⃣ ปิด record เดิม
            const sqlDeactivateOld = `
        UPDATE Truck_Mainternance_invoice_approved
        SET is_active = 0
        WHERE invoice_id = @invoice_id
      `;
            await executeQueryEmployeeAccessDB(sqlDeactivateOld, { invoice_id: id });

            // 2️⃣ เพิ่ม record ใหม่
            const sqlApprover = `
        INSERT INTO Truck_Mainternance_invoice_approved (
          invoice_approved_emp_id,
          invoice_id,
          approval_checked,
          is_active,
          created_at,
          updated_at,
          approval_note
        )
        VALUES (
          @invoice_approved_emp_id,
          @invoice_id,
          @approval_checked,
          @is_active,
          GETDATE(),
          @updated_at,
          @approval_note
        )
      `;

            const values = {
                invoice_approved_emp_id: invoice_approver_emp_id,
                invoice_id: id,
                approval_checked: approvalBit,
                is_active: 1,
                updated_at: invoice_approver_date || new Date(),
                approval_note: invoice_approver_note
            };

            await executeQueryEmployeeAccessDB(sqlApprover, values);

            const sqlInvoice = ` UPDATE Truck_Mainternance_invoice SET status = @status  WHERE invoice_id = @invoice_id `;
                        const valueInvoice = { status: 'approved', invoice_id: id };
            await executeQueryEmployeeAccessDB(sqlInvoice, valueInvoice);

            res.status(200).json({ message: 'Invoice approval recorded successfully' });
        } catch (error) {
            console.error('Error updating invoice:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },
};
