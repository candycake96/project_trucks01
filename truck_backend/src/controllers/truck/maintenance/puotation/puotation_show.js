const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    quotation_show_analysis_id: async (req, res) => {
        try {
            const { id } = req.params;

            const query = ` 
                SELECT 
                    q.quotation_id,
                    q.analysis_id,
                    q.vendor_id,
                    q.quotation_date,
                    q.quotation_file,
                    q.note,
                    q.is_selected,
                    q.quotation_vat,
                    q.vendor_name,

                    vd.vendor_type_id,
                    vd.organization_type_id,
                    vd.contact_person,
                    vd.phone,
                    vd.email,
                    vd.address,
                    vd.delivery_address,
                    vd.tax_id,
                    vd.file_vendor,
                    vd.credit_terms,
                    vd.status,
                    vd.warranty_policy,
                    vd.remarks,

                    qp.quotation_parts_id,
                    qp.part_id,
                    qp.part_name,
                    qp.maintenance_type,
                    qp.part_price,
                    qp.part_unit,
                    qp.part_qty,
                    qp.part_discount,
                    qp.is_approved_part,
                    qp.part_vat,
                    qp.approval_checked

                FROM Truck_repair_garage_quotation q 
                JOIN Truck_vendor vd ON vd.vendor_id = q.vendor_id 
                LEFT JOIN Truck_repair_quotation_parts qp ON qp.quotation_id = q.quotation_id 
                WHERE q.analysis_id = @analysis_id AND is_selected = 'True'
            `;

            const result = await executeQueryEmployeeAccessDB(query, { analysis_id: id });

            if (result && result.length > 0) {
                const groupedData = result.reduce((acc, row) => {
                    let existing = acc.find(item => item.quotation_id === row.quotation_id);
                    const quotation_vat = parseFloat(row.quotation_vat || 0);

                    const discount = parseFloat(row.part_discount || 0);
                    const part_qty = parseFloat(row.part_qty || 0);
                    const part_price = parseFloat(row.part_price || 0);
                    const part_vat = parseFloat(row.part_vat || 0);

                    // คำนวณราคาสุทธิ (total_part)
                    const total_part = (part_qty * part_price) - discount;

                    // คำนวณ VAT ของ part ตามส่วนลดและจำนวน
                    const part_vat_by_quotation = (total_part * part_vat) / 100;

                    // ราคาหลังรวม VAT
                    const total_price_with_vat = total_part + part_vat_by_quotation;

                    const part = row.quotation_parts_id ? {
                        quotation_parts_id: row.quotation_parts_id,
                        part_id: row.part_id,
                        part_name: row.part_name,
                        maintenance_type: row.maintenance_type,
                        part_price: part_price,
                        part_unit: row.part_unit,
                        part_qty: part_qty,
                        part_discount: discount,
                        is_approved_part: row.is_approved_part,
                        approval_checked: row.approval_checked,
                        total_part: parseFloat(total_part.toFixed(2)),
                        part_vat_by_quotation: parseFloat(part_vat_by_quotation.toFixed(2)),
                        part_vat: part_vat,   // % VAT ของ part (อาจจะต่างจาก quotation_vat)
                        total_price_with_vat: parseFloat(total_price_with_vat.toFixed(2))
                    } : null;


                    if (existing) {
                        if (part) existing.parts.push(part);
                    } else {
                        acc.push({
                            quotation_id: row.quotation_id,
                            analysis_id: row.analysis_id,
                            vendor_id: row.vendor_id,
                            quotation_date: row.quotation_date,
                            quotation_file: row.quotation_file,
                            note: row.note,
                            is_selected: row.is_selected,
                            quotation_vat: quotation_vat,
                            vendor_name: row.vendor_name,

                            vendor_type_id: row.vendor_type_id,
                            organization_type_id: row.organization_type_id,
                            contact_person: row.contact_person,
                            phone: row.phone,
                            email: row.email,
                            address: row.address,
                            delivery_address: row.delivery_address,
                            tax_id: row.tax_id,
                            file_vendor: row.file_vendor,
                            credit_terms: row.credit_terms,
                            status: row.status,
                            warranty_policy: row.warranty_policy,
                            remarks: row.remarks,

                            parts: part ? [part] : []
                        });
                    }

                    return acc;
                }, []);

                // ✅ คำนวณ subtotal, vat, grand total
groupedData.forEach(item => {
    // 1. รวมราคาก่อน VAT (total_part)
    const subtotal = item.parts.reduce((sum, p) => sum + (p.total_part || 0), 0);

    // 2. รวมส่วนลดจากทุก part
    const total_discount = item.parts.reduce((sum, p) => sum + (p.part_discount || 0), 0);

    // 3. รวม VAT ของแต่ละ part (จาก field part_vat_by_quotation)
    const total_part_vat = item.parts.reduce((sum, p) => sum + (p.part_vat_by_quotation || 0), 0);

    // 4. VAT จาก quotation (หากมี)
    const vatRate = item.quotation_vat ? parseFloat(item.quotation_vat) : 0;
    const vat_amount = subtotal * (vatRate / 100);

    // 5. รวมสุทธิ (subtotal + VAT จาก quotation)
    const grand_total = subtotal + vat_amount;

    // 6. รวมราคาหลัง VAT ของแต่ละ part (ราคาจริงที่ซื้อขายต่อ row)
    const total_price_with_vat_per_parts = item.parts.reduce((sum, p) => sum + (p.total_price_with_vat || 0), 0);

    // ✅ เก็บทั้งหมดลง item เพื่อ frontend ใช้งาน
    item.subtotal = parseFloat(subtotal.toFixed(2));                     // ไม่รวม VAT
    item.total_discount = parseFloat(total_discount.toFixed(2));         // รวมส่วนลด
    item.total_part_vat = parseFloat(total_part_vat.toFixed(2));         // รวม VAT ของแต่ละ part
    item.vat_amount = parseFloat(vat_amount.toFixed(2));                 // VAT จาก quotation
    item.grand_total = parseFloat(grand_total.toFixed(2));               // รวมสุทธิ
    item.total_price_with_vat_per_parts = parseFloat(total_price_with_vat_per_parts.toFixed(2)); // ราคาทั้งหมดหลัง VAT ต่อ part
});




                res.status(200).json(groupedData);
            } else {
                res.status(404).json({ message: "No data found in quotation table" });
            }

        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    }
};






