const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    VehicleAdd: async (req, res) => {
        try {
            console.log(req.body);
            console.log(req.files);

            let formData = {};
            let isFinance = {};
            // let formInsurance = {};
            let formTransportInsurance = {};
            let formGoodsInsurance = {};

            // Safely parse form data and handle errors
            try {
                formData = req.body.formData ? JSON.parse(req.body.formData) : {};
                isFinance = req.body.isFinance ? JSON.parse(req.body.isFinance) : {};
                // formInsurance = req.body.formInsurance ? JSON.parse(req.body.formInsurance) : {};
                formTransportInsurance = req.body.formTransportInsurance ? JSON.parse(req.body.formTransportInsurance) : {};
                formGoodsInsurance = req.body.formGoodsInsurance ? JSON.parse(req.body.formGoodsInsurance) : {};

            } catch (parseError) {
                console.error('❌ JSON Parse Error:', parseError);
                return res.status(400).json({ message: 'Invalid JSON format', error: parseError.message });
            }

            // Check for required fields
            if (!formData.reg_date || !formData.reg_number || !formData.car_type_id) {
                return res.status(400).json({ message: 'Missing required fields: reg_date, reg_number, or car_type_id' });
            }

            // File handling with fallback to null if not provided
            const fileDownload = req.files['file_download'] ? req.files['file_download'][0].filename : null;
            const fileFinance = req.files['file_finance'] ? req.files['file_finance'][0].filename : null;
            

            // Helper function to format dates
            const formatDate = (date) => date ? new Date(date).toISOString().slice(0, 19).replace('T', ' ') : null;

            const VehicleData = {
                reg_date: formatDate(formData.reg_date),
                reg_number: formData.reg_number,
                province: formData.province,
                fuel: formData.fuel,
                car_type_id: formData.car_type_id,
                chassis_number: formData.chassis_number,
                usage_type_id: formData.usage_type_id,
                car_brand: formData.car_brand,
                model_no: formData.model_no,
                color: formData.color,
                engine_brand: formData.engine_brand,
                engine_no: formData.engine_no,
                cylinders: formData.cylinders,
                veh_weight: formData.veh_weight,
                max_load: formData.max_load,
                gross_weight: formData.gross_weight,
                possession_date: formatDate(formData.possession_date),
                operators: formData.operators,
                nation: formData.nation,
                addr: formData.addr,
                trans_type: formData.trans_type,
                license_no: formData.license_no,
                license_expiry: formatDate(formData.license_expiry),
                rights_to_use: formData.rights_to_use,
                owner_name: formData.owner_name,
                address: formData.address,
                passenger_count: formData.passenger_count,
                file_download: fileDownload,
                vehicle_type_id: formData.vehicle_type_id,
                chassis_number_location: formData.chassis_number_location,
                engine_on_location: formData.engine_on_location,
                engine_power: formData.engine_power,
                document_order: formData.document_order,
                reg_doc_number: formData.reg_doc_number,
                inspection_code: formData.inspection_code,
                id_branch: formData.id_branch,
                tax_end: formatDate(formData.tax_end),
                cmi_start: formatDate(formData.cmi_start),
                cmi_end: formatDate(formData.cmi_end),
                axle_count:formData.axle_count,
                wheel_count:formData.wheel_count,
                tire_count:formData.tire_count,
                status: formData.status
            };

            // Insert vehicle data into the database
            const insertVehicleQuery = `INSERT INTO Truck_vehicle_registration (
                reg_date, reg_number, province, fuel, car_type_id, chassis_number, usage_type_id, car_brand, model_no, 
                color, engine_brand, engine_no, cylinders, veh_weight, max_load, gross_weight, possession_date, operators, 
                nation, addr, trans_type, license_no, license_expiry, rights_to_use, owner_name, address, passenger_count, 
                file_download, vehicle_type_id, chassis_number_location, engine_on_location, engine_power, document_order, 
                reg_doc_number, inspection_code, id_branch, tax_end, cmi_start, cmi_end, axle_count, wheel_count, tire_count, status
            ) OUTPUT INSERTED.reg_id VALUES (
                @reg_date, @reg_number, @province, @fuel, @car_type_id, @chassis_number, @usage_type_id, @car_brand, 
                @model_no, @color, @engine_brand, @engine_no, @cylinders, @veh_weight, @max_load, @gross_weight, 
                @possession_date, @operators, @nation, @addr, @trans_type, @license_no, @license_expiry, @rights_to_use, 
                @owner_name, @address, @passenger_count, @file_download, @vehicle_type_id, @chassis_number_location, 
                @engine_on_location, @engine_power, @document_order, @reg_doc_number, @inspection_code, @id_branch, 
                @tax_end, @cmi_start, @cmi_end, @axle_count, @wheel_count, @tire_count, @status
            )`;

            const [vehicleResult] = await executeQueryEmployeeAccessDB(insertVehicleQuery, VehicleData);
            console.log('✅ Vehicle Inserted, reg_id:', vehicleResult.reg_id);

            const reg_id = vehicleResult && vehicleResult.reg_id ? vehicleResult.reg_id : null; 
            console.log('✅ Vehicle Inserted, reg_id:', reg_id);

            if (!reg_id) {
                console.error('❌ reg_id is undefined or invalid');
                // return res.status(400).json({ message: 'Invalid vehicle registration' });
                return res.status(400).json({ duplicate: true, message: "Invalid vehicle registration!", errors_row: { engine_no : "Invalid vehicle registration" }});
            }
            

            // Insert insurance data
            const queryInsurance = `INSERT INTO Truck_car_insurance (
                insurance_vehicle_id, insurance_type, insurance_converage_amount, insurance_premium, insurance_company, 
                insurance_start_date, insurance_end_date, insurance_file
            ) VALUES (
                @insurance_vehicle_id, @insurance_type, @insurance_converage_amount, @insurance_premium, @insurance_company, 
                @insurance_start_date, @insurance_end_date, @insurance_file
            )`;
            const fileInsurance = req.files['insurance_file'] ? req.files['insurance_file'][0].filename : null;// จัดการไฟล์ที่อัปโหลดทั้งหมดในฟิลด์ 'insurance_file'
            if (formTransportInsurance) {  
                console.log('✅ test **** Vehicle Inserted, reg_id:', reg_id);             
                const valueInsuranceData = {
                    insurance_vehicle_id: reg_id,
                    insurance_type: formTransportInsurance.insurance_type || 0,
                    insurance_converage_amount: formTransportInsurance.insurance_converage_amount || 0,
                    insurance_premium: formTransportInsurance.insurance_premium || 0,
                    insurance_company: formTransportInsurance.insurance_company || '',
                    insurance_start_date: formatDate(formTransportInsurance.insurance_start_date) ||  null,
                    insurance_end_date: formatDate(formTransportInsurance.insurance_end_date) || null,
                    insurance_file: fileInsurance || null
                };
                await executeQueryEmployeeAccessDB(queryInsurance, valueInsuranceData);
            }

            const fileInsuranceGoods = req.files['insurance_goods_file'] ? req.files['insurance_goods_file'][0].filename : null;// จัดการไฟล์ที่อัปโหลดทั้งหมดในฟิลด์ 'insurance_file'
            if (formGoodsInsurance) {                
                const valueInsuranceGoodsData = {
                    insurance_vehicle_id: reg_id,
                    insurance_type: formGoodsInsurance.insurance_type || 0,
                    insurance_converage_amount: formGoodsInsurance.insurance_converage_amount || 0,
                    insurance_premium: formGoodsInsurance.insurance_premium || 0,
                    insurance_company: formGoodsInsurance.insurance_company || '',
                    insurance_start_date: formatDate(formGoodsInsurance.insurance_start_date) || null,
                    insurance_end_date: formatDate(formGoodsInsurance.insurance_end_date) || null,
                    insurance_file: fileInsuranceGoods || null
                };
                await executeQueryEmployeeAccessDB(queryInsurance, valueInsuranceGoodsData);
            }

            // Insert finance data only if valid
            if (isFinance.start_date && isFinance.end_date && isFinance.insurance_company) {
                const FinanceData = {
                    reg_id: reg_id,
                    loan_amount: isFinance.loan_amount || 0,
                    interest_rate: isFinance.interest_rate || 0,
                    monthly_payment: isFinance.monthly_payment || 0,
                    start_date: formatDate(isFinance.start_date) || null,
                    end_date: formatDate(isFinance.end_date) || null,
                    insurance_company: isFinance.insurance_company || '',
                    file_finance: fileFinance || null
                };

                const insertFinanceQuery = `INSERT INTO Truck_auto_loans (
                    reg_id, loan_amount, interest_rate, monthly_payment, start_date, end_date, insurance_company, file_finance
                ) VALUES (
                    @reg_id, @loan_amount, @interest_rate, @monthly_payment, @start_date, @end_date, @insurance_company, @file_finance
                )`;
                await executeQueryEmployeeAccessDB(insertFinanceQuery, FinanceData);
                console.log('✅ Finance Inserted');
            } else {
                console.log('❌ Finance data missing or invalid, skipping insert');
            }

            // Return success response
            return res.status(201).json({ message: 'Upload successful', reg_id, fileDownload, fileFinance });

        } catch (error) {
            console.error('❌ Database Error:', error);
            return res.status(500).json({ message: 'มีข้อมูลบางอย่างผิดพลาดกรุณาตรวจสอบใหม่อีกครั้ง', error });
        }
    },

    checkDuplicate_VehicleAdd: async (req, res) => {
        const { chassis_number, reg_number, province, engine_no, car_type_id } = req.body;
    
        try {
            let query = `SELECT 
                            COUNT(CASE WHEN reg_number = @reg_number AND province = @province THEN 1 END) AS reg_number_count,
                            COUNT(CASE WHEN chassis_number = @chassis_number THEN 1 END) AS chassis_number_count,
                            COUNT(CASE WHEN engine_no = @engine_no THEN 1 END) AS engine_no_count
                         FROM truck_vehicle_registration 
                         WHERE status = 'active'`;
    
            if (car_type_id === 2) {
                query += " AND engine_no IS NOT NULL";
            }
    
            const rows = await executeQueryEmployeeAccessDB(query, { reg_number, province, chassis_number, engine_no });
    
            if (!rows || (Array.isArray(rows) && rows.length === 0)) {
                return res.status(404).json({ error: "ไม่พบข้อมูลจากฐานข้อมูล" });
            }
    
            const {
                reg_number_count = 0,
                chassis_number_count = 0,
                engine_no_count = 0
            } = Array.isArray(rows) ? rows[0] || {} : rows;
    
            if (reg_number_count > 0) {
                return res.json({ duplicate: true, message: "เลขทะเบียนนี้ถูกใช้ไปแล้ว!", errors_row:  { reg_number : "กรุณากรอกวันที่จดทะเบียน" }});
            }
    
            if (chassis_number_count > 0) {
                return res.json({ duplicate: true, message: "เลขตัวถังนี้ถูกใช้ไปแล้ว!", errors_row:   { chassis_number : "กรุณากรอกวันที่จดทะเบียน" }});
            }
    
            if (engine_no_count > 0) {
                return res.json({ duplicate: true, message: "เลขเครื่องยนต์นี้ถูกใช้ไปแล้ว!", errors_row: { engine_no : "กรุณากรอกวันที่จดทะเบียน" }});
            }
    
            res.json({ duplicate: false });
        } catch (error) {
            console.error("❌ Database error:", error);
            res.status(500).json({ error: "Database error" });
        }
    }
};
