const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
  invoice_update: async (req, res) => {
    try {
      console.log('Data from frontend:', req.body);
      console.log('Params:', req.params);

      const { id } = req.params; // ใช้เป็น invoice_id
      const {
        invoice_no,
        request_id,
        invoice_date,
        invoice_created_emp_id,
        invoice_sections,
      } = req.body;

      // ✅ แปลง invoice_sections จาก string → JSON object
      const sections = JSON.parse(invoice_sections);

      // ✅ 1. อัปเดตข้อมูล invoice หลัก
      const updateInvoiceSql = `
        UPDATE Truck_Mainternance_invoice
        SET 
          invoice_no = @invoice_no,
          request_id = @request_id,
          invoice_created_emp_id = @invoice_created_emp_id,
          status = @status,
          updated_at = GETDATE()
        WHERE invoice_id = @invoice_id
      `;

      await executeQueryEmployeeAccessDB(updateInvoiceSql, {
        invoice_no,
        request_id,
        invoice_created_emp_id,
        status: 'draft',
        invoice_id: id,
      });

      // ✅ 2. ลบ part ก่อน แล้วลบ section
      await executeQueryEmployeeAccessDB(
        `DELETE FROM Truck_Mainternance_invoice_part 
         WHERE invoice_section_id IN (
           SELECT invoice_section_id 
           FROM Truck_Mainternance_invoice_section 
           WHERE invoice_id = @invoice_id
         )`,
        { invoice_id: id }
      );

      await executeQueryEmployeeAccessDB(
        `DELETE FROM Truck_Mainternance_invoice_section WHERE invoice_id = @invoice_id`,
        { invoice_id: id }
      );

      // ✅ 3. เพิ่ม section และ part ใหม่จาก sections array
      const sqlInsertSection = `
        INSERT INTO Truck_Mainternance_invoice_section (
          note,
          invoice_id,
          section_number
        ) OUTPUT INSERTED.invoice_section_id VALUES (
          @note,
          @invoice_id,
          @section_number
        )
      `;

      const sqlInsertPart = `
        INSERT INTO Truck_Mainternance_invoice_part (
          invoice_section_id,
          part_id,
          part_name,
          maintenance_type,
          part_price,
          part_unit,
          part_qty,
          part_discount,
          part_vat
        ) VALUES (
          @invoice_section_id,
          @part_id,
          @part_name,
          @maintenance_type,
          @part_price,
          @part_unit,
          @part_qty,
          @part_discount,
          @part_vat
        )
      `;

      for (const [index, section] of sections.entries()) {
        const sectionData = {
          note: section.note || '',
          invoice_id: id,
          section_number: index + 1,
        };

        // ✅ แทรก section และดึง invoice_section_id
        const resultSection = await executeQueryEmployeeAccessDB(sqlInsertSection, sectionData);
        const sectionId = resultSection[0].invoice_section_id;

        // ✅ แทรก parts ทั้งหมดใน section นั้น
        for (const part of section.part) {
          const partData = {
            invoice_section_id: sectionId,
            part_id: part.part_id ? parseInt(part.part_id, 10) : null,
            part_name: part.part_name || '',
            maintenance_type: part.maintenance_type || '',
            part_price: part.price ? parseFloat(part.price) : 0,
            part_unit: part.unit || '',
            part_qty: part.qty ? parseInt(part.qty, 10) : 0,
            part_discount: part.discount ? parseFloat(part.discount) : 0,
            part_vat: part.vat ? parseFloat(part.vat) : 0
          };

          await executeQueryEmployeeAccessDB(sqlInsertPart, partData);
        }
      }

      res.status(200).json({ message: 'Invoice updated successfully' });
    } catch (error) {
      console.error('Error updating invoice:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },
};
