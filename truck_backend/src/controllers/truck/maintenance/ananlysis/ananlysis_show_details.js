const { executeQueryEmployeeAccessDB } = require('../../../../config/db');
const baseUrl = process.env.BASE_URL;

module.exports = {

    ananlysis_show_details: async (req, res) => {
        try {
            const { id } = req.params;
            // 1. ดึงข้อมูล analysis
            const sqlAnalysis = `SELECT 
                a.analysis_id,
                a.request_id,
                a.plan_date,
                a.remark,
                a.is_quotation_required,
                a.analysis_emp_id,
                a.urgent_repair,
                a.inhouse_repair,
                a.send_to_garage,
                a.is_pm,
                a.is_cm,
                a.plan_time,
                e.fname,
                e.lname
            FROM Truck_repair_analysis a
            INNER JOIN employees e ON e.id_emp = a.analysis_emp_id
            WHERE request_id = @request_id`;
            const analysisResult = await executeQueryEmployeeAccessDB(sqlAnalysis, { request_id: id });

            if (!analysisResult || analysisResult.length === 0) {
                return res.status(404).json({ message: "Analysis not found" });
            }

            const analysis = analysisResult[0];

            // 2. ดึงข้อมูล quotations ทั้งหมดของ analysis นี้
            const sqlQuotations = `SELECT 
                q.quotation_id,
                q.analysis_id,
                q.vendor_id,
                q.quotation_file,
                q.quotation_date,
                q.quotation_vat,
                q.note,
                q.is_selected,
                q.vendor_name,
                v1.vendor_name
            FROM Truck_repair_garage_quotation q
            INNER JOIN Truck_vendor v1 ON v1.vendor_id = q.vendor_id
            WHERE analysis_id = @analysis_id`;
            let quotations = await executeQueryEmployeeAccessDB(sqlQuotations, { analysis_id: analysis.analysis_id });

            // 3. ดึง parts ของแต่ละ quotation และแปลง quotation_file เป็น URL
            const sqlParts = `SELECT 
                p1.quotation_parts_id,
                p1.quotation_id,
                p1.part_id,
                p1.part_name,
                p1.maintenance_type,
                p1.part_price,
                p1.part_vat,
                p1.part_unit,
                p1.part_qty,
                p1.part_discount,
                p1.item_id,
                s.system_name
            FROM Truck_repair_quotation_parts p1
            INNER JOIN Truck_vehicle_systems s ON s.system_id = p1.part_id
            WHERE quotation_id = @quotation_id`;

            quotations = await Promise.all(quotations.map(async (quotation) => {
                // แปลง quotation_file เป็น URL
                return {
                    ...quotation,
                    quotation_file: quotation.quotation_file
                        ? `${baseUrl}/api/QT_MTN/${quotation.quotation_file}`
                        : null,
                    parts: await executeQueryEmployeeAccessDB(sqlParts, { quotation_id: quotation.quotation_id })
                };
            }));

            // 4. ส่งข้อมูลกลับ
            res.status(200).json({
                analysis,
                quotations
            });

        } catch (error) {
            console.error("Error fetching analysis details:", error);
            res.status(500).json({ message: "Error fetching analysis details", error: error.message });
        }
    },

}