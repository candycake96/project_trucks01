const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {
    ananlysis_update: async (req, res) => {
        try {
            const { id } = req.params;
            console.log("🔄 UPDATE ANALYSIS ID:", id);
            console.log("🧾 BODY:", req.body);
            console.log("📎 FILES:", req.files);

            // แปลง quotations ให้เป็น Array เสมอ
            let quotations = [];
            if (typeof req.body.quotations === 'string') {
                quotations = JSON.parse(req.body.quotations);
            } else if (Array.isArray(req.body.quotations)) {
                quotations = req.body.quotations;
            }

            // STEP 1: อัปเดต Truck_repair_analysis
            await executeQueryEmployeeAccessDB(`
                UPDATE Truck_repair_analysis SET 
                    request_id = @request_id,
                    plan_date = @plan_date,
                    remark = @remark,
                    is_quotation_required = @is_quotation_required,
                    analysis_emp_id = @analysis_emp_id,
                    urgent_repair = @urgent_repair,
                    inhouse_repair = @inhouse_repair,
                    send_to_garage = @send_to_garage,
                    is_pm = @is_pm,
                    is_cm = @is_cm,
                    plan_time = @plan_time
                WHERE analysis_id = @analysis_id
            `, {
                analysis_id: Number(req.body.analysis_id),
                request_id: Number(req.body.request_id),
                plan_date: req.body.plan_date,
                remark: req.body.remark,
                is_quotation_required: req.body.is_quotation_required,
                analysis_emp_id: req.body.analysis_emp_id,
                urgent_repair: req.body.urgent_repair,
                inhouse_repair: req.body.inhouse_repair,
                send_to_garage: req.body.send_to_garage,
                is_pm: req.body.is_pm,
                is_cm: req.body.is_cm,
                plan_time: req.body.plan_time
            });

            // STEP 2: ตรวจสอบและลบ quotation เดิมที่หายไป
            const oldQuotations = await executeQueryEmployeeAccessDB(
                `SELECT quotation_id FROM Truck_repair_garage_quotation WHERE analysis_id = @analysis_id`,
                { analysis_id: Number(req.body.analysis_id) }
            );

            const oldIds = oldQuotations.map(q => q.quotation_id); // ดึง ID ทั้งหมดจากฐานข้อมูล
            const newIds = quotations.filter(q => q.quotation_id).map(q => q.quotation_id); // ดึง ID จากข้อมูลที่ส่งเข้ามา
            const toDeleteIds = oldIds.filter(oldId => !newIds.includes(oldId)); // หา ID ที่อยู่ในฐานข้อมูลแต่ไม่มีในข้อมูลใหม่


            for (const quotationId of toDeleteIds) {

                console.log('กำลังอัปเดต quotation_id:', quotationId);

                await executeQueryEmployeeAccessDB(
                    `DELETE FROM Truck_repair_quotation_parts WHERE quotation_id = @quotation_id`,
                    { quotation_id: quotationId }
                );

                await executeQueryEmployeeAccessDB(
                    `DELETE FROM Truck_repair_garage_quotation WHERE quotation_id = @quotation_id`,
                    { quotation_id: quotationId }
                );
            }

            // STEP 3: จัดการ quotation & parts
            for (const quotation of quotations) {
                let quotationId = quotation.quotation_id || null;

                // 3.1 UPDATE quotation
                if (quotationId) {
                    await executeQueryEmployeeAccessDB(
                        `UPDATE Truck_repair_garage_quotation SET
                            analysis_id = @analysis_id,
                            vendor_id = @vendor_id,
                            quotation_file = @quotation_file,
                            quotation_date = @quotation_date,
                            quotation_vat = @quotation_vat,
                            note = @note,
                            is_selected = @is_selected,
                            vendor_name = @vendor_name
                        WHERE quotation_id = @quotation_id`,
                        {
                            quotation_id: quotationId,
                            analysis_id: id,
                            vendor_id: Number(quotation.vendor_id),
                            quotation_file: quotation.quotation_file,
                            quotation_date: quotation.quotation_date,
                            quotation_vat: Number(quotation.quotation_vat || 0),
                            note: quotation.note,
                            is_selected: Number(quotation.is_selected || 0),
                            vendor_name: quotation.vendor_name,

                        }
                    );
                }

                // 3.2 INSERT quotation
                if (!quotationId) {
                    const insertResult = await executeQueryEmployeeAccessDB(
                        `INSERT INTO Truck_repair_garage_quotation (
                            analysis_id, vendor_id, quotation_file,
                            quotation_date, quotation_vat, note, 
                            is_selected, vendor_name
                        )
                        OUTPUT INSERTED.quotation_id
                        VALUES (
                            @analysis_id, @vendor_id, @quotation_file,
                            @quotation_date, @quotation_vat, @note, 
                            @is_selected, @vendor_name
                        )`,
                        {
                            analysis_id: Number(req.body.analysis_id),
                            vendor_id: Number(quotation.vendor_id),
                            quotation_file: quotation.quotation_file,
                            quotation_date: quotation.quotation_date,
                            quotation_vat: Number(quotation.quotation_vat || 0),
                            note: quotation.note,
                            is_selected: Number(quotation.is_selected || 0),
                            vendor_name: quotation.vendor_name || ''
                        }
                    );

                    quotationId = Array.isArray(insertResult) && insertResult.length > 0
                        ? insertResult[0].quotation_id
                        : insertResult?.quotation_id;

                    quotation.quotation_id = quotationId;
                }

                if (!quotationId) {
                    console.warn(`❌ ไม่มี quotationId สำหรับ quotation:`, quotation);
                    continue;
                }

                // 3.3 จัดการ parts
                const newParts = Array.isArray(quotation.parts) ? quotation.parts : [];
                if (!newParts || newParts.length === 0) {
                    console.log(`ℹ️ ไม่มี parts สำหรับ quotationId: ${quotationId}`);
                    continue;
                }

                console.log('📦 Quotation ID:', quotationId);
                console.log('🆕 New Parts:', newParts);

                const existingParts = await executeQueryEmployeeAccessDB(
                    `SELECT quotation_parts_id FROM Truck_repair_quotation_parts WHERE quotation_id = @quotation_id`,
                    { quotation_id: quotationId }
                );

                const oldPartIds = existingParts.map(p => String(p.quotation_parts_id));
                const newPartIdsFromClient = newParts
                    .filter(p => p.quotation_parts_id !== undefined && p.quotation_parts_id !== null)
                    .map(p => String(p.quotation_parts_id));``
                const toDeletePartIds = oldPartIds.filter(id => !newPartIdsFromClient.includes(id));

                for (const partId of toDeletePartIds) {
                    await executeQueryEmployeeAccessDB(
                        `DELETE FROM Truck_repair_quotation_parts WHERE quotation_parts_id = @quotation_parts_id`,
                        { quotation_parts_id: Number(partId) }
                    );
                }

                console.log("DEBUG → oldPartIds:", oldPartIds);
                console.log("DEBUG → newPartIdsFromClient:", newPartIdsFromClient);
                console.log("DEBUG → toDeletePartIds:", toDeletePartIds);

                // ✅ เพิ่ม/อัปเดต parts
                for (const part of newParts) {
                    const foundInOldParts = oldPartIds.includes(String(part.quotation_parts_id));
                    if (part.quotation_parts_id && !foundInOldParts) {
                        console.warn(`⚠️ part.quotation_parts_id = ${part.quotation_parts_id} ไม่มีในฐานข้อมูล — จะ INSERT แทน`);
                        part.quotation_parts_id = undefined; // ล้าง id เก่าเพื่อ insert ใหม่
                    }

                    const partData = {
                        item_id: part.item_id || '',
                        quotation_parts_id: part.quotation_parts_id ? Number(part.quotation_parts_id) : undefined,
                        quotation_id: quotationId,
                        part_id: part.part_id ? Number(part.part_id) : null,
                        part_name: part.part_name || '',
                        maintenance_type: part.maintenance_type || '',
                        part_price: Number(part.price || 0),
                        part_vat: Number(part.vat || 0),
                        part_unit: part.unit || '',
                        part_qty: Number(part.qty || 0),
                    };

                    if (partData.quotation_parts_id) {
                        await executeQueryEmployeeAccessDB(
                            `UPDATE Truck_repair_quotation_parts SET 
                                item_id = @item_id,
                                quotation_id = @quotation_id,
                                part_id = @part_id,
                                part_name = @part_name,
                                maintenance_type = @maintenance_type,
                                part_price = @part_price,
                                part_vat = @part_vat,
                                part_unit = @part_unit,
                                part_qty = @part_qty
                            WHERE quotation_parts_id = @quotation_parts_id`,
                            partData
                        );
                    } else {
                        await executeQueryEmployeeAccessDB(
                            `INSERT INTO Truck_repair_quotation_parts (
                                item_id, quotation_id, part_id, part_name,
                                maintenance_type, part_price, part_vat, part_unit, part_qty
                            ) VALUES (
                                @item_id, @quotation_id, @part_id, @part_name,
                                @maintenance_type, @part_price, @part_vat, @part_unit, @part_qty
                            )`,
                            partData
                        );
                    }
                }
            }

            // STEP 4: Response
            res.status(200).json({
                message: '✅ Analysis updated successfully',
                quotations
            });

        } catch (error) {
            console.error("❌ Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    }
};
