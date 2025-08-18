const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    car_insurance_add: async (req, res) => {
        console.log(req.body);
        console.log(req.files);
        try {
            const { id } = req.params;
console.log('test', id);
            let formData = {};
            formData = req.body.formData ? JSON.parse(req.body.formData) : {};
            console.log('Raw formData string from req.body:', req.body.formData);

            if (!formData.insurance_start_date || !formData.insurance_end_date) {
                return res.status(400).json({ message: 'ข้อมูลวันที่เริ่มต้นสิ้นสุดไม่ถูกต้อง' });
              }              

            const insuranceFile = req.files['insurance_file'] ? req.files['insurance_file'][0].filename : null;

            const formatDate = (date) => date ? new Date(date).toISOString().slice(0, 19).replace('T', ' ') : null;

            const value = {
                class_id: formData.class_id,
                coverage_id: formData.coverage_id,
                insurance_company: formData.insurance_company,
                insurance_start_date: formatDate(formData.insurance_start_date),
                insurance_end_date: formatDate(formData.insurance_end_date),
                insurance_converage_amount: formData.insurance_converage_amount,
                insurance_premium: formData.insurance_premium,
                insurance_vehicle_id: id,
                insurance_file: insuranceFile || null,
            };

            console.log("Form data being submitted:", value);

            // ✅ เพิ่มข้อมูลลงฐานข้อมูล
            const insertQuery = `
                INSERT INTO Truck_car_insurance 
                (
                    class_id,
                    coverage_id,
                    insurance_company,
                    insurance_start_date,
                    insurance_end_date,
                    insurance_converage_amount,
                    insurance_premium,
                    insurance_vehicle_id,
                    insurance_file
                ) 
                VALUES 
                (
                    @class_id,
                    @coverage_id,
                    @insurance_company,
                    @insurance_start_date,
                    @insurance_end_date,
                    @insurance_converage_amount,
                    @insurance_premium,
                    @insurance_vehicle_id,
                    @insurance_file
                );
            `;

            const result = await executeQueryEmployeeAccessDB(insertQuery, value);
            res.status(200).json({ message: 'ข้อมูลประกันภัยรถถูกเพิ่มเรียบร้อยแล้ว' });

        } catch (error) {
            console.error('❌ Database Error:', error);
            return res.status(500).json({ message: 'มีข้อมูลบางอย่างผิดพลาดกรุณาตรวจสอบใหม่อีกครั้ง', error });
        }
    }
};
