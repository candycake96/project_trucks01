const { executeQueryEmployeeAccessDB } = require('../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const baseUrl = process.env.BASE_URL;

module.exports = {

    getCompany: async (req, res) => {
        const query = `SELECT * FROM company`;

        try {
            const result = await executeQueryEmployeeAccessDB(query);

            // ตรวจสอบว่า result มีค่าและมีข้อมูลหรือไม่
            if (result && result.length > 0) {
                // เพิ่ม URL ของรูปภาพ
                const fileUrl = result.map(reg => ({
                    ...reg, // คัดลอกข้อมูลเดิม
                    company_logo: reg.company_logo
                        ? `${baseUrl}/api/company/imglogo/${reg.company_logo}`
                        : null, // ตรวจสอบว่ามีรูปภาพหรือไม่
                }));

                res.status(200).json(fileUrl);
            } else {
                console.warn("⚠️ ไม่มีข้อมูลในตาราง Truck_vehicle_registration");
                res.status(404).json({ message: "No data found in Truck_vehicle_registration table" });
            }

        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },


    getCompanyID: async (req, res) => {
        const { id } = req.params;
        const value = { company_id: id };
        const query = `SELECT * FROM company WHERE company_id = @company_id`;

        try {
            const result = await executeQueryEmployeeAccessDB(query, value);

            // ตรวจสอบว่า result มีค่าและมีข้อมูลหรือไม่
            if (result && result.length > 0) {
                // เพิ่ม URL ของรูปภาพ
                const fileUrl = result.map(reg => ({
                    ...reg, // คัดลอกข้อมูลเดิม
                    company_logo: reg.company_logo
                        ? `${baseUrl}/api/company/imglogo/${reg.company_logo}`
                        : null, // ตรวจสอบว่ามีรูปภาพหรือไม่
                }));

                res.status(200).json(fileUrl);
            } else {
                console.warn("⚠️ ไม่มีข้อมูลในตาราง Truck_vehicle_registration");
                res.status(404).json({ message: "No data found in Truck_vehicle_registration table" });
            }
        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    // เพิ่มข้อมูลบริษัท
    addCompany: async (req, res) => {
        try {
            // รับค่าจาก req.body
            const formData = req.body.formDataCompany ? JSON.parse(req.body.formDataCompany) : {};
            const fileDownload = req.file ? req.file.filename : null;

            // ตรวจสอบว่ามีข้อมูลที่จำเป็นหรือไม่
            if (!formData.company_name || !formData.company_address) {
                return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
            }

            // เตรียมข้อมูลสำหรับเพิ่มลงฐานข้อมูล
            const sql = `INSERT INTO company (company_name, company_address, status, company_logo) VALUES (@company_name, @company_address, @status, @company_logo)`;

            // บันทึกลงฐานข้อมูล
            const result = await executeQueryEmployeeAccessDB(sql, {
                company_name: formData.company_name,
                company_address: formData.company_address,
                status: "Active",
                company_logo: fileDownload
            });

            res.status(201).json({ success: true, message: "เพิ่มบริษัทสำเร็จ", companyId: result.insertId });

        } catch (error) {
            console.error("Server Error: ", error);
            res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
        }
    },


     editCompany: async (req, res) => {
        try {
            const { company_id } = req.params; // รับค่า company_id จาก URL params
            const formData = req.body.formData ? JSON.parse(req.body.formData) : req.body;
            const newLogo = req.file ? req.file.filename : null; // ไฟล์ที่อัปโหลด (ถ้ามี)
    
            if (!company_id) {
                return res.status(400).json({ success: false, message: "Company ID is required" });
            }
    
            if (!formData.company_name || !formData.company_address) {
                return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
            }
    
            // ตรวจสอบว่ามีการอัปโหลดโลโก้ใหม่หรือไม่
            let updateQuery = `
                UPDATE company 
                SET company_name = @company_name, 
                    company_address = @company_address
            `;
    
            // ถ้ามีไฟล์ใหม่ให้เพิ่ม company_logo เข้าไปในคำสั่ง UPDATE
            if (newLogo) {
                updateQuery += `, company_logo = @company_logo`;
            }
    
            updateQuery += ` WHERE company_id = @company_id`;
    
            // สร้างออบเจ็กต์สำหรับ parameterized query
            const params = {
                company_name: formData.company_name,
                company_address: formData.company_address,
                company_id: company_id
            };
    
            if (newLogo) {
                params.company_logo = newLogo;
            }
    
            // อัปเดตข้อมูล
            await executeQueryEmployeeAccessDB(updateQuery, params);
    
            res.status(200).json({ success: true, message: "Company updated successfully" });
    
        } catch (error) {
            console.error("Error updating company:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

}