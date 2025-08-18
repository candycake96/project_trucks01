const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    vehicle_status_shows: async (req, res) => {
        const { id } = req.params;
        const query = `
        SELECT 
        t1.status, t1.status_annotation, t1.file_status, t1.status_active_date, t1.reg_id
        FROM  Truck_vehicle_registration t1
        WHERE reg_id = @reg_id
         `;
         if (!id) {
            return res.status(400).json({ message: "Missing reg_id in request" });
        }        
        const value = { reg_id: id }
        try {
            const result = await executeQueryEmployeeAccessDB(query, value);
            if (result.length > 0) {
                  // เพิ่ม URL ของรูปภาพ
            const fileUrl = result.map(reg => ({
                ...reg, // คัดลอกข้อมูลเดิม
                file_status: reg.file_status 
                    ? `${req.protocol}://${req.get('host')}/api/status_doc/${reg.file_status}`
                    : null, // ตรวจสอบว่ามีรูปภาพหรือไม่
            }));
                res.status(200).json(fileUrl);
            } else {
                console.warn("⚠️ ไม่มีข้อมูลในตาราง Truck_vehicle_registration");
                res.status(404).json({ message: "No data found in Truck_vehicle_registration table" });
            }            
        } catch (error) {
            console.warn("⚠️ ไม่มีข้อมูลในตาราง Truck_vehicle_registration");
            res.status(404).json({ message: "No data found in Truck_vehicle_registration table" });
        }
    },

    vehicle_status_upddate: async (req, res) => {
        console.log("📥 Incoming Request Body:", req.body);
        console.log("📁 Uploaded Files:", req.files);

        let formData = {};
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing reg_id" });
        }

        try {
            formData = req.body.formData ? JSON.parse(req.body.formData) : req.body;
            console.log("✅ Parsed formData:", formData);
        } catch (error) {
            console.error('❌ JSON Parse Error:', error);
            return res.status(400).json({ message: 'Invalid JSON format', error: error.message });
        }

        console.log("🧐 File Field Names:", req.files ? Object.keys(req.files) : "No files uploaded");

        const fileStatus = req.files?.file_status?.[0]?.filename || null;
        console.log("📄 Extracted file_status:", fileStatus);

        const statusData = {
            reg_id: id,
            status: formData.status,
            file_status: fileStatus,
            status_annotation: formData.status_annotation,
            status_active_date: formData.status_active_date
        };

        console.log("📝 Query Parameters:", statusData);

        const query = `
            UPDATE Truck_vehicle_registration SET 
            status = @status,
            status_annotation = @status_annotation,
            file_status = @file_status,
            status_active_date = @status_active_date
            WHERE reg_id = @reg_id 
        `;

        try {
            console.log("🚀 Executing Query...");
            const result = await executeQueryEmployeeAccessDB(query, statusData);
            console.log("✅ Query Execution Result:", result);

            res.status(200).json({ success: true, message: "Updated successfully" });

        } catch (error) {
            // ตรวจสอบว่า error.response มีข้อมูลหรือไม่
            if (error.response) {
                // เมื่อได้รับ error จาก API
                console.error("❌ API Error:", error.response.data);
                setError(error.response.data.message || "An error occurred while saving data. Please try again.");
            } else if (error.request) {
                // เมื่อไม่ได้รับ response จาก API
                console.error("❌ No response from API:", error.request);
                setError("No response from server. Please try again later.");
            } else {
                // ข้อผิดพลาดที่เกิดจากการตั้งค่าใน code
                console.error("❌ Error in setup:", error.message);
                setError("An error occurred while saving data. Please try again.");
            }
        }
    },


};
