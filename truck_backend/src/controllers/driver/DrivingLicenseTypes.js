const { executeQueryEmployeeAccessDB } = require('../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {

    getDrivingLicenseTypes: async (req, res) => {
            const query = `SELECT * FROM driving_license_types `;

            try {
                const result = await executeQueryEmployeeAccessDB(query);

                if (result && result.length > 0 ){
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "NO data found in branches table"});
                }

            } catch (error) {
                console.error("Database query :", error);
                res.status(500).send("Database query failed");
            }
    },

    


}