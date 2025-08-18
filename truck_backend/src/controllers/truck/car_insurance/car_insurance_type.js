const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {

    car_insurance_types: async (req, res) => {
        const query = `SELECT * FROM Truck_car_insurance_types 
        `;
        try {
            const result = await executeQueryEmployeeAccessDB(query);
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "No data found in Insurance type table" })
            }

        } catch (error) {
            console.warn("⚠️ ไม่มีข้อมูลในตาราง Truck_car_insurance");
            res.status(500).json({ message: "No data found in Truck_car_insurance table" });
        }
    },



   
}