const fs = require('fs');
const path = require('path');
const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    car_insurance_update: async (req, res) => {
        try {
            const { id } = req.params;
            const formData = req.body.formData ? JSON.parse(req.body.formData) : req.body;
            const uploadedInsuranceFile = req.files?.['insurance_file']?.[0]?.filename || null;

            if (!id) {
                return res.status(400).json({ success: false, message: "ID is required" });
            }

            // 🧪 Log ชื่อไฟล์ใหม่
            console.log("📥 New file upload:", uploadedInsuranceFile);

            if (uploadedInsuranceFile) {
                const query = `
                    SELECT insurance_file 
                    FROM Truck_car_insurance 
                    WHERE insurance_id = @insurance_id
                `;
                const value = { insurance_id: id };
                const result = await executeQueryEmployeeAccessDB(query, value);

                if (result.length === 0) {
                    return res.status(404).json({ success: false, message: "Insurance not found" });
                }

                const oldInsuranceFile = result[0].insurance_file;

                if (oldInsuranceFile) {
                    const filePath = path.join(__dirname, '../upload/insurance_doc', oldInsuranceFile);
                    
                    // 🧪 Log path ว่าตรงกับที่ไฟล์อยู่จริงไหม
                    console.log("📁 Check delete path:", filePath);

                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log("✅ Deleted old file:", oldInsuranceFile);
                    } else {
                        console.log("❌ File not found for deletion:", filePath);
                    }
                }
            }

            // Build SET fields
            const setFields = [
                "class_id = @class_id",
                "coverage_id = @coverage_id",
                "insurance_company = @insurance_company",
                "insurance_start_date = @insurance_start_date",
                "insurance_end_date = @insurance_end_date",
                "insurance_converage_amount = @insurance_converage_amount",
                "insurance_premium = @insurance_premium"
            ];

            if (uploadedInsuranceFile) {
                setFields.push("insurance_file = @insurance_file");
            }

            const updateQuery = `
                UPDATE Truck_car_insurance SET
                    ${setFields.join(', ')}
                WHERE insurance_id = @insurance_id
            `;

            const params = {
                class_id: formData.class_id,
                coverage_id: formData.coverage_id,
                insurance_company: formData.insurance_company,
                insurance_start_date: formData.insurance_start_date,
                insurance_end_date: formData.insurance_end_date,
                insurance_converage_amount: formData.insurance_converage_amount,
                insurance_premium: formData.insurance_premium,
                insurance_id: id,
            };

            if (uploadedInsuranceFile) {
                params.insurance_file = uploadedInsuranceFile;
            }

            await executeQueryEmployeeAccessDB(updateQuery, params);

            res.status(200).json({ success: true, message: "Insurance updated successfully" });

        } catch (error) {
            console.error("🔥 Error updating insurance:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};
