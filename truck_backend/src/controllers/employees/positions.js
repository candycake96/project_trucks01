const { executeQueryEmployeeAccessDB } = require('../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const company = require('./company');

module.exports = {

    getPositions: async (req, res) => {
            const {id} = req.params;
            const query = `SELECT * FROM positions WHERE company_id = @company_id AND position_status = 'Active'`;
            const value = {company_id : id};

            try {
                const result = await executeQueryEmployeeAccessDB(query, value);

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