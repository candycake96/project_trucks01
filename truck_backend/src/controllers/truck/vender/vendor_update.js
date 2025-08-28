const fs = require("fs");
const path = require("path");
const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    vendor_update: async (req, res) => {
        const queryUpdateVendor = `
UPDATE Truck_vendor
SET
    vendor_name = @vendor_name,
    contact_person = @contact_person,
    phone = @phone,
    email = @email,
    address = @address,
    delivery_address = @delivery_address,
    tax_id = @tax_id,
    organization_type_id = @organization_type_id,
    file_vendor = @file_vendor,
    credit_terms = @credit_terms,
    warranty_policy = @warranty_policy,
    vendor_type_id = @vendor_type_id,
    remarks = @remarks
WHERE vendor_id = @vendor_id;
        `;

        try {
            const { id } = req.params;

            if (!id) return res.status(400).json({ message: "vendor_id is required" });

            let formData = {};
            try {
                formData = req.body.formDataVendor ? JSON.parse(req.body.formDataVendor) : {};
            } catch (error) {
                return res.status(400).json({ message: "Invalid JSON in formDataVendor" });
            }

            // ตรวจสอบไฟล์ใหม่
            const newFile = req.files?.file_vendor ? req.files.file_vendor[0].filename : null;
            let fileVendor = formData.existing_file_vendor || null;

            // ถ้ามีไฟล์ใหม่และมีไฟล์เก่า ลบไฟล์เก่า
            if (newFile && fileVendor) {
                const oldFilePath = path.join(__dirname, "../../../src/uploads/vendor_doc", fileVendor);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                    console.log("ลบไฟล์เก่า:", fileVendor);
                }
                fileVendor = newFile;
            } else if (newFile) {
                fileVendor = newFile; // ถ้าไม่มีไฟล์เก่า ใช้ไฟล์ใหม่
            }
            console.log('service_id', formData)
            const VendorData = {
                vendor_id: id,
                vendor_name: formData.vendor_name,
                contact_person: formData.contact_person,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                delivery_address: formData.delivery_address,
                tax_id: formData.tax_id,
                organization_type_id: formData.organization_type_id,
                file_vendor: fileVendor,
                credit_terms: formData.credit_terms,
                warranty_policy: formData.warranty_policy,
                vendor_type_id: formData.vendor_type_id,
                remarks: formData.remarks
            };

            if (!VendorData.vendor_name || !VendorData.organization_type_id || !VendorData.vendor_type_id) {
                return res.status(400).json({ message: "Required fields missing" });
            }

            await executeQueryEmployeeAccessDB(queryUpdateVendor, VendorData);

            // อัปเดตบริการ
            const queryDeleteServices = `DELETE FROM Truck_vendor_services WHERE vendor_id = @vendor_id;`;
            await executeQueryEmployeeAccessDB(queryDeleteServices, { vendor_id: id });
            const queryInsertService = `INSERT INTO Truck_vendor_services (vendor_id, service_id) VALUES (@vendor_id, @service_id);`;
            if (Array.isArray(formData.service_id) && formData.service_id.length > 0) {
                for (const idS of formData.service_id) {

                    await executeQueryEmployeeAccessDB(queryInsertService, { vendor_id: id, service_id: idS });
                }
            }

            res.status(200).json({ message: "Update successful", id });

        } catch (error) {
            console.error("Database update failed:", error);
            res.status(500).json({ message: "Database update failed", error: error.message });
        }
    }
};
