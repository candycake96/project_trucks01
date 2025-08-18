const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    DetailsCarType: async (req, res) => {
       const query = `SELECT * FROM Truck_car_types `;

       try{
        const result = await executeQueryEmployeeAccessDB(query);

        if ( result && result.length > 0 ) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No data found in Truck car type table"})
        }
       } catch (error) {
        console.error("Database query failed", error);
        res.status(500).json({message: "Database query failed", error: error.message});
       }
    }
};

