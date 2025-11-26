const { executeQueryEmployeeAccessDB } = require('../../../../config/db');

module.exports = {

    invoice_add: async (req, res) => {
        try {
            console.log("Received request to add analysis with body:", req.body);
            console.log(req.files);
            const {
                request_id,
                invoice_created_emp_id,
                invoice_sections
            } = req.body;

            const requestDate = new Date();
            const formattedDate = requestDate.toISOString().split("T")[0];

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
            const resultSetting = await executeQueryEmployeeAccessDB(sqlSetting);
            if (!resultSetting || resultSetting.length === 0) {
                return res.status(404).json({ message: "ไม่พบการตั้งค่าเลขเอกสาร" });
            }

            const {
                doc_set_prefix,
                date_part,
                reset_type,
                doc_order
            } = resultSetting[0];

            const formatDatePart = (format, date = new Date()) => {
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();

                const formatted = format
                    .replace(/dd/g, dd)
                    .replace(/mm/g, mm)
                    .replace(/yyyy/g, yyyy);

                // ลบเครื่องหมาย / หรือสัญลักษณ์อื่น ๆ ถ้ามี
                return formatted.replace(/[^\w]/g, ''); // ลบทุกตัวที่ไม่ใช่ a-zA-Z0-9

            };

            const formattedDatePart = formatDatePart(date_part, requestDate); // เช่น 2025/05/22

            let sqlCount = `SELECT COUNT(*) AS count FROM Truck_Mainternance_invoice WHERE 1=1 `;
            const countParams = {};

            if (reset_type === 'daily') {
                sqlCount += ` AND CONVERT(date, invoice_date) = @invoice_date `;
                countParams.invoice_date = formattedDate;

            } else if (reset_type === 'monthly') {
                sqlCount += ` AND MONTH(invoice_date) = @month AND YEAR(invoice_date) = @year `;
                countParams.month = requestDate.getMonth() + 1;
                countParams.year = requestDate.getFullYear();

            } else if (reset_type === 'yearly') {
                sqlCount += ` AND YEAR(invoice_date) = @year `;

                countParams.year = requestDate.getFullYear();
            }

            // ถ้า reset_type === 'never' ก็ไม่เพิ่มเงื่อนไข (นับทั้งหมด)

            const resultCount = await executeQueryEmployeeAccessDB(sqlCount, countParams);
            const count = resultCount[0].count + 1;


            const runningNumber = String(count).padStart(4, "0");

            // สร้างส่วนประกอบของเอกสาร
            const parts = {
                1: runningNumber,       // ลำดับเลข
                2: formattedDatePart,   // วันที่
                3: doc_set_prefix       // Prefix
            };

            // แปลง doc_order เป็น array แล้วประกอบตามลำดับ
            // let invoice_no = "";
            // if (doc_order) {
            //     invoice_no = doc_order
            //         .split(",")          // แยกด้วย comma
            //         .map(num => parts[num.trim()])  // แปลงเป็นค่าจริง
            //         .filter(Boolean)     // กรองค่า null หรือ undefined
            //         .join("-");          // ต่อด้วย "-"
            // } else {
            //     // fallback ถ้าไม่มี doc_order
            //     invoice_no = `${doc_set_prefix}-${formattedDatePart}-${runningNumber}`;
            // }

            const orderArray = doc_order ? doc_order.split(",") : [];
            invoice_no = orderArray.map(num => parts[num.trim()] || '').filter(Boolean).join("-");
            if (!invoice_no) {
                invoice_no = `${doc_set_prefix}-${formattedDatePart}-${runningNumber}`;
            }


            // --------------------------------
            // -------------------

            const invoiceFile = req.files['invoice_doc'] ? req.files['invoice_doc'][0].filename : null;

            // const lastInvoice = await executeQueryEmployeeAccessDB(
            //     `SELECT MAX(CAST(invoice_no AS INT)) AS last_no FROM Truck_Mainternance_invoice`, {}
            // );
            // const invoice_no = lastInvoice[0].last_no ? lastInvoice[0].last_no + 1 : 1;


            const sqlInvoice = `
                INSERT INTO Truck_Mainternance_invoice (
                invoice_no,
                request_id,
                invoice_date,
                invoice_created_emp_id,
                status,
                invoice_doc
                ) OUTPUT INSERTED.invoice_id VALUES (
                @invoice_no,
                @request_id,
                @invoice_date,
                @invoice_created_emp_id,
                @status,
                @invoice_doc
                )`;

            const valueInvoice = {
                invoice_no: invoice_no,
                request_id: request_id,
                invoice_date: new Date(),
                invoice_created_emp_id: invoice_created_emp_id,
                status: 'draft',
                invoice_doc: invoiceFile || ''
            }
            const resultInvoice = await executeQueryEmployeeAccessDB(sqlInvoice, valueInvoice);
            const InvoiceID = resultInvoice[0].invoice_id;


            const sqlRQ = `UPDATE Truck_repair_requests SET status = @status WHERE  request_id = @request_id`;
            const valueRQ = { status: "ใบแจ้งหนี้", request_id: request_id };
            await executeQueryEmployeeAccessDB(sqlRQ, valueRQ);


            const sqlSection = `INSERT INTO Truck_Mainternance_invoice_section (
                                    note,
                                    invoice_id,
                                    section_number
                                ) OUTPUT INSERTED.invoice_section_id VALUES (
                                    @note,
                                    @invoice_id,
                                    @section_number
                                )`;

            const sections = JSON.parse(invoice_sections);

            const sqlParts = `INSERT INTO Truck_Mainternance_invoice_part (
                                invoice_section_id,
                                part_id,
                                part_name,
                                maintenance_type,
                                part_price,
                                part_unit,
                                part_qty,
                                part_discount
                            ) VALUES (
                                @invoice_section_id,
                                @part_id,
                                @part_name,
                                @maintenance_type,
                                @part_price,
                                @part_unit,
                                @part_qty,
                                @part_discount                            
                            )`;

            for (const [index, section] of sections.entries()) {
                const valueSection = {
                    note: section.note || "",
                    invoice_id: InvoiceID,
                    section_number: index + 1
                };
                const resultSection = await executeQueryEmployeeAccessDB(sqlSection, valueSection);
                const SectionID = resultSection[0].invoice_section_id;

                for (const part of section.part) {
                    const valuePart = {
                        invoice_section_id: SectionID,
                        part_id: part.part_id ? parseInt(part.part_id, 10) : null,
                        part_name: part.part_name || "",
                        maintenance_type: part.maintenance_type || "",
                        part_price: part.price ? parseFloat(part.price) : 0,
                        part_unit: part.unit || "",
                        part_qty: part.qty ? parseInt(part.qty, 10) : 0,
                        part_discount: part.discount ? parseFloat(part.discount) : 0
                    };

                    console.log("Inserting part with values:", valuePart); // ✅ debug ดูค่าก่อน insert
                    await executeQueryEmployeeAccessDB(sqlParts, valuePart);
                }


            };

            res.status(200).json({ message: "Invoice created successfully", invoice_id: InvoiceID });
        } catch (error) {
            // ถ้ามี error จะ log และส่ง error กลับไป
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

}
