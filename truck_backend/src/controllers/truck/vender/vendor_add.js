const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    vendor_add: async (req, res) => {

        const query = `
INSERT INTO Truck_vendor (
    vendor_name,
    contact_person,
    phone,
    email,
    address,
    delivery_address,
    tax_id,
    organization_type_id,
    file_vendor,
    credit_terms,
    status,
    warranty_policy,
    vendor_type_id,
    remarks
)
    OUTPUT INSERTED.vendor_id
VALUES (
    @vendor_name,
    @contact_person,
    @phone,
    @email,
    @address,
    @delivery_address,
    @tax_id,
    @organization_type_id, 
    @file_vendor,
    @credit_terms,
    @status,
    @warranty_policy,
    @vendor_type_id,
    @remarks
);
        `;

        const fileVendor = req.files['file_vendor'] ? req.files['file_vendor'][0].filename : null;
        try {
            let formData = {};
            try {
                formData = req.body.formDataVendor ? JSON.parse(req.body.formDataVendor) : {};
            } catch (error) {
                return res.status(400).json({ message: "Invalid JSON in formDataVendor" });
            }
            const VendorData = {
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
                status: 'active',
                warranty_policy: formData.warranty_policy,
                vendor_type_id: formData.vendor_type_id,
                remarks: formData.remarks
            };

            if (!VendorData.vendor_name || !VendorData.organization_type_id || !VendorData.vendor_type_id) {
                return res.status(400).json({ message: "Required fields missing" });
            }

            const [result] = await executeQueryEmployeeAccessDB(query, VendorData);
            const vendorId = result.vendor_id; // ใช้ insertId แทน vendor_id
            console.log("Vendor ID ที่เพิ่ม:", vendorId);

            const queryService = `INSERT INTO Truck_vendor_services (vendor_id, service_id) VALUES (@vendor_id, @service_id);`;
            //  // Handle service selection
            if (Array.isArray(formData.service_id) && formData.service_id.length > 0) {
                for (const id of formData.service_id) {
                    console.log("บริการที่เลือก:", id);
                    const valueService = {
                        vendor_id: vendorId,
                        service_id: id
                    };
                    await executeQueryEmployeeAccessDB(queryService, valueService);
                }
            } else {
                return res.status(400).json({ message: "No service selected" });
            }
 
            // Check if insert was successful
            res.status(200).json({ message: "Insert successful", vendorId });

        } catch (error) {
            // จัดการข้อผิดพลาดจากฐานข้อมูล
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

}

