const { executeQueryEmployeeAccessDB } = require('../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {

    getDriver: async (req, res) => {

        const query = `
        SELECT 
            er.*, 
            emp.code, emp.lname, emp.fname, emp.nickname, emp.gender, emp.phone, emp.email, emp.date_job, 
            emp.id_position, emp.id_department, emp.id_branch, emp.created, emp.status, emp.identification_number,
            b.branch_name,
            (
                SELECT 
                    STUFF((SELECT ', ' + lt.license_code
                           FROM driver_license dl
                            INNER JOIN driving_license_types lt ON dl.license_type_id = lt.license_type_id
                           WHERE dl.id_emp = emp.id_emp
                           FOR XML PATH('')), 1, 2, '')
            ) AS license_code
        FROM 
           Employee_Roles er
        INNER JOIN 
            employees emp ON er.id_emp = emp.id_emp
        INNER JOIN 
            branches b ON emp.id_branch =b.id_branch
        WHERE 
            er.role_id = 3 AND emp.status = 'Active'
        ORDER BY 
            emp.id_emp ASC;
    `;
    

            try {
                const result = await executeQueryEmployeeAccessDB(query);

                if (result && result.length > 0 ){
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "NO data found in branches table"});
                }

            } catch (error) {
                console.error("Database query :", error);
                res.status(500).send("Database query failed ");
            }
    },

    


}