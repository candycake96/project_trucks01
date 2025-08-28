const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const baseUrl = process.env.BASE_URL;

module.exports = {

    vendor_show: async (req, res) => {
        try {
        const query = `
        SELECT 
        v.*,
        o.organization_type_name,
        vt.vendor_type_name
        FROM Truck_vendor v
        INNER JOIN Truck_vendor_organization_type o ON o.organization_type_id = v.organization_type_id
        INNER JOIN Truck_vendor_types vt ON vt.vendor_type_id = v.vendor_type_id
        `
        
        const result = await executeQueryEmployeeAccessDB(query);

        if ( result && result.length > 0 ) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No data found in Truck_vendor_types table"})
        }
       } catch (error) {
        console.error("Database query failed", error);
        res.status(500).json({message: "Database query failed", error: error.message});
       }
    },


    vendor_show_details: async (req, res) => {
        const { id } = req.params;
        const query = `
                        SELECT 
                            v.vendor_id,
                            v.vendor_type_id,
                            v.organization_type_id,
                            v.vendor_name,
                            v.contact_person,
                            v.phone,
                            v.email,
                            v.address,
                            v.delivery_address,
                            v.tax_id,
                            v.file_vendor,
                            v.credit_terms,
                            v.status,
                            v.warranty_policy,
                            v.remarks,
                            o.organization_type_name,
                            vt.vendor_type_name,
                            STUFF((
                                SELECT ',' + CAST(st.service_id AS NVARCHAR) + ':' + st.service_name
                                FROM Truck_vendor_services vs
                                LEFT JOIN Truck_vendor_service_types st 
                                    ON st.service_id = vs.service_id
                                WHERE vs.vendor_id = v.vendor_id
                                FOR XML PATH(''), TYPE
                            ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS service_list
                        FROM Truck_vendor v
                        INNER JOIN Truck_vendor_organization_type o 
                            ON o.organization_type_id = v.organization_type_id
                        INNER JOIN Truck_vendor_types vt 
                            ON vt.vendor_type_id = v.vendor_type_id
                        WHERE v.vendor_id = @vendor_id;
                     `;
        
        try {
            const result = await executeQueryEmployeeAccessDB(query, {
                vendor_id: parseInt(id),
            });
    
            console.log("Query Result:", result);
    
            if (result && result.length > 0) {
                const fileUrl = result.map(reg => ({
                    ...reg, // คัดลอกข้อมูลเดิม
                    file_vendor: reg.file_vendor 
                        ? `${baseUrl}/api/vendor_doc/${reg.file_vendor}`
                        : null, // ตรวจสอบว่ามีรูปภาพหรือไม่
                }));
    
                res.status(200).json(fileUrl[0]); // หรือ result ทั้งหมดถ้าต้องการ
            } else {
                res.status(404).json({ message: "No data found for this vendor" });
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    


}
