const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    vehicle_update_doc: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Missing vehicle ID" });
            }

            const {
                reg_date,
                reg_number,
                province,
                fuel,
                chassis_number,
                usage_type_id,
                car_brand,
                model_no,
                color,
                engine_brand,
                engine_no,
                cylinders,
                veh_weight,
                max_load,
                gross_weight,
                possession_date,
                operators,
                nation,
                addr,
                trans_type,
                license_no,
                license_expiry,
                rights_to_use,
                owner_name,
                address,
                passenger_count,
                vehicle_type_id,
                chassis_number_location,
                engine_on_location,
                engine_power,
                document_order,
                reg_doc_number,
                inspection_code,
                cmi_end,
                axle_count,
                wheel_count,
                tire_count
            } = req.body;

            const values = {
                reg_date,
                reg_number,
                province,
                fuel,
                chassis_number,
                usage_type_id,
                car_brand,
                model_no,
                color,
                engine_brand,
                engine_no,
                cylinders,
                veh_weight,
                max_load,
                gross_weight,
                possession_date,
                operators,
                nation,
                addr,
                trans_type,
                license_no,
                license_expiry,
                rights_to_use,
                owner_name,
                address,
                passenger_count,
                vehicle_type_id,
                chassis_number_location,
                engine_on_location,
                engine_power,
                document_order,
                reg_doc_number,
                inspection_code,
                axle_count,
                wheel_count,
                tire_count,
                reg_id: id,
                cmi_end: cmi_end,

            };

            const query = `UPDATE Truck_vehicle_registration SET
                reg_date = @reg_date,
                reg_number = @reg_number,
                province = @province,
                fuel = @fuel,
                chassis_number = @chassis_number,
                usage_type_id = @usage_type_id,
                car_brand = @car_brand,
                model_no = @model_no,
                color = @color,
                engine_brand = @engine_brand,
                engine_no = @engine_no,
                cylinders = @cylinders,
                veh_weight = @veh_weight,
                max_load = @max_load,
                gross_weight = @gross_weight,
                possession_date = @possession_date,
                operators = @operators,
                nation = @nation,
                addr = @addr,
                trans_type = @trans_type,
                license_no = @license_no,
                license_expiry = @license_expiry,
                rights_to_use = @rights_to_use,
                owner_name = @owner_name,
                address = @address,
                passenger_count = @passenger_count,
                vehicle_type_id = @vehicle_type_id,
                chassis_number_location = @chassis_number_location,
                engine_on_location = @engine_on_location,
                engine_power = @engine_power,
                document_order = @document_order,
                reg_doc_number = @reg_doc_number,
                inspection_code = @inspection_code,
                 cmi_end = @cmi_end, 
                 axle_count = @axle_count, 
                 wheel_count = @wheel_count, 
                 tire_count = @tire_count
                WHERE reg_id = @reg_id
            `;

            const result = await executeQueryEmployeeAccessDB(query, values);

            if (result.affectedRows > 0) {
                return res.status(200).json({ message: "Vehicle data updated successfully" });
            } else {
                return res.status(404).json({ message: "No record found with the given ID" });
            }
        } catch (error) {
            console.error("❌ เกิดข้อผิดพลาดในการอัปเดทข้อมูลรถ:", error);
            res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดทข้อมูลรถ", error });
        }
    },





    vehicle_updata_other_doc: async (req, res) => {
        console.log(req.body);
        console.log(req.files);
        try {
            const { id } = req.params;
            const formData = req.body.formDataObj ? JSON.parse(req.body.formDataObj) : req.body;

            const fileDownload = req.files['file_download'] ? req.files['file_download'][0].filename : null;

            let updateQuery = `UPDATE Truck_vehicle_registration SET
                car_type_id = @car_type_id,
                id_branch = @id_branch`;

            // Add condition for updating file if present
            if (fileDownload) {
                updateQuery += `, file_download = @file_download`;
            }

            // Add WHERE condition
            updateQuery += ` WHERE reg_id = @reg_id`;

            // Create an object for the data to be updated
            const params = {
                car_type_id: formData.car_type_id,
                id_branch: formData.id_branch,
                reg_id: id  // Add reg_id directly in the params
            };

            // Add file download if present
            if (fileDownload) {
                params.file_download = fileDownload;
            }

            // Log VehicleData for debugging
            console.log('VehicleData:', { car_type_id: formData.car_type_id, id_branch: formData.id_branch, reg_id: id, file_download: fileDownload });

            // Log SQL parameters for debugging
            console.log('SQL Params:', params);

            // Execute the query with params
            await executeQueryEmployeeAccessDB(updateQuery, params);

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


    vehicle_updata_tax: async (req, res) => {
        try {
            const { id } = req.params;
            const { tax_end } = req.body;
            let query = `UPDATE Truck_vehicle_registration SET tax_end = @tax_end WHERE reg_id = @reg_id`
            const value = { reg_id: id, tax_end: tax_end };
            const results = await executeQueryEmployeeAccessDB(query, value);
            res.status(200).json({ success: true, message: "Updated successfully" });
        } catch (error) {
            console.error("❌ Error:", error);

            res.status(500).json({
                success: false,
                message: "An error occurred while updating tax_end.",
                error: error.message,
            });
        }
    },

    vehicle_updata_cmi: async (req, res) => {
        try {
            const { id } = req.params;
            const { cmi_start, cmi_end } = req.body;
            let query = `UPDATE Truck_vehicle_registration SET cmi_start = @cmi_start, cmi_end = @cmi_end WHERE reg_id = @reg_id`
            const value = { reg_id: id, cmi_start: cmi_start, cmi_end: cmi_end };
            const results = await executeQueryEmployeeAccessDB(query, value);
            res.status(200).json({ success: true, message: "Updated successfully" });
        } catch (error) {
            console.error("❌ Error:", error);

            res.status(500).json({
                success: false,
                message: "An error occurred while updating cmi.",
                error: error.message,
            });
        }
    },

    vehicle_updata_insurance: async (req, res) => {
        try {
            const { id } = req.params;
            const { insurance_start, insurance_end, insurance_name } = req.body;
            let query = `UPDATE Truck_vehicle_registration SET insurance_start = @insurance_start, insurance_end = @insurance_end, insurance_name = @insurance_name WHERE reg_id = @reg_id`
            const value = { reg_id: id, insurance_start: insurance_start, insurance_end: insurance_end, insurance_name: insurance_name };
            const results = await executeQueryEmployeeAccessDB(query, value);
            res.status(200).json({ success: true, message: "Updated successfully" });
        } catch (error) {
            console.error("❌ Error:", error);

            res.status(500).json({
                success: false,
                message: "An error occurred while updating insurance.",
                error: error.message,
            });
        }
    },

}
