const { executeQueryEmployeeAccessDB } = require('../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {
    addEmployeesDriver: async (req, res) => {

        // const uploadedFileName = req.file ? req.file.filename : null;
        

        try {
            const { employeeInfo, currentAddress, permanentAddress, driverLicenses, roles, salaryMaster, socialsecurityMaster, providentFundsMaster, permissionCode } = req.body;
            
            // Ensure all required fields are provided
            if (!employeeInfo || !currentAddress || !permanentAddress || !roles ) {
                return res.status(400).json({ message: 'All fields are required' });
            }
    
            const uploadedFileName = req.files['file_download'] ? req.files['file_download'][0].filename : null;

            // Parse JSON strings
            const employeeData = JSON.parse(employeeInfo);
            const currentAddr = JSON.parse(currentAddress);
            const permanentAddr = JSON.parse(permanentAddress);
            const licenses = JSON.parse(driverLicenses);
            const roleList = JSON.parse(roles);
            const reliableSalary = JSON.parse(salaryMaster);
            const socialsecurityMasterData = JSON.parse(socialsecurityMaster);
            const providentFundsMasterData = JSON.parse(providentFundsMaster);
            const permissionCodeData = JSON.parse(permissionCode);
    
            // Add uploaded file path to employee data
            // if (req.file) {
            //     employeeData.image = req.file.filename;
            // }
            console.log('permissionCode: ', permissionCodeData)
            // console.log('Parsed Employee Info:', employeeData);
            console.log('Current Address:', currentAddr);
            console.log('Permanent Address:', permanentAddr);
            console.log('Driver Licenses:', licenses);
            console.log('Roles:', roleList);
            console.log('Salarie:', reliableSalary);
            console.log('Salarie:', socialsecurityMasterData);
            console.log('Salarie:', providentFundsMasterData);

            // Hash password
            const hashedPassword = await bcrypt.hash(employeeData.password, 10);

            // Insert employee data
            const query = `
                INSERT INTO employees
                (code, fname, lname, nickname, gender, phone, email, date_job,
                 id_position, id_department, id_branch, company_id, status, identification_number, image)
                OUTPUT INSERTED.id_emp
                VALUES (@code, @fname, @lname, @nickname, @gender, @phone, @email, @date_job,
                        @id_position, @id_department, @id_branch, @company_id, @status, @identification_number, @image);
            `;

            const employeeValues = {
                code: employeeData.code,
                fname: employeeData.fname,
                lname: employeeData.lname,
                nickname: employeeData.nickname,
                gender: employeeData.gender,
                phone: employeeData.phone,
                email: employeeData.email,
                date_job: employeeData.date_job,
                id_position: employeeData.id_position,
                id_department: employeeData.id_department,
                id_branch: employeeData.id_branch,
                company_id: employeeData.company_id,
                status: employeeData.status,
                identification_number: employeeData.identification_number,
                image: uploadedFileName,
            };

            // Execute employee insertion and get the inserted employee's ID
            const [employeeResult] = await executeQueryEmployeeAccessDB(query, employeeValues);

            // Get the inserted employee's ID
            const employeeId = employeeResult.id_emp;

            // Insert hashed password into the 'password' table
            const queryPassword = `
                INSERT INTO password (password, id_emp)
                VALUES (@password, @id_emp);
            `;
            await executeQueryEmployeeAccessDB(queryPassword, { password: hashedPassword, id_emp: employeeId });

            // Insert salarie 
            const salarieQuery= `INSERT INTO salaries (id_emp, base_salary, effective_date) VALUES (@id_emp, @base_salary, @effective_date)`;
            await executeQueryEmployeeAccessDB(salarieQuery, {id_emp: employeeId, base_salary: reliableSalary.base_salary, effective_date: reliableSalary.effective_date})

             // Insert socialseculity
            const socialseculityQuery= `INSERT INTO social_security (id_emp, contribution_rate, contribution_amount, effective_date) VALUES (@id_emp, @contribution_rate, @contribution_amount, @effective_date)`;
            await executeQueryEmployeeAccessDB(socialseculityQuery, {id_emp: employeeId, contribution_rate: socialsecurityMasterData.contribution_rate, contribution_amount: socialsecurityMasterData.contribution_amount, effective_date: socialsecurityMasterData.effective_date})
            
             // Insert salarie 
             const providentFundsQuery= `INSERT INTO provident_funds (id_emp, employee_rate, employee_contribution, effective_date) VALUES (@id_emp, @employee_rate, @employee_contribution, @effective_date)`;
             await executeQueryEmployeeAccessDB(providentFundsQuery, {id_emp: employeeId, employee_rate: providentFundsMasterData.employee_rate, employee_contribution: providentFundsMasterData.employee_contribution, effective_date: providentFundsMasterData.effective_date })
             
            // Insert current address
            const addressInsertQuery = `
                INSERT INTO employee_addresses
                (id_emp, house_number, street, city, province, postal_code, country, address_type)
                VALUES (@employeeId, @house_number, @street, @city, @province, @postal_code, @country, @address_type);
            `;
            await executeQueryEmployeeAccessDB(addressInsertQuery, { employeeId, ...currentAddr, address_type: 'current' });
            await executeQueryEmployeeAccessDB(addressInsertQuery, { employeeId, ...permanentAddr, address_type: 'permanent' });

            // Insert driver licenses
            const licenseInsertQuery = `
                INSERT INTO driver_license (id_emp, license_number, issued_date, expiry_date, license_type_id, issuing_authority, status)
                VALUES (@employee_id, @license_number, @issued_date, @expiry_date, @license_type, @issuing_authority, @status)
            `;
            for (const license of licenses) {
                await executeQueryEmployeeAccessDB(licenseInsertQuery, { employee_id: employeeId, ...license });
            }

            // Insert roles
            const roleInsertQuery = `
                INSERT INTO employee_roles (id_emp, role_id)
                VALUES (@employee_id, @role_id)
            `;
            for (const roleId of roleList) {
                await executeQueryEmployeeAccessDB(roleInsertQuery, { employee_id: employeeId, role_id: roleId });
            }

            const sqlEmpPermissionAccess = `INSERT INTO employee_permission_access (emp_id, permission_code) VALUES (@emp_id, @permission_code)`;
            for (const permissionCode of permissionCodeData) {
                await executeQueryEmployeeAccessDB(sqlEmpPermissionAccess, {emp_id: employeeId, permission_code: permissionCode} );
            }

            // Respond with success
            res.status(200).json({ message: 'Employee added successfully', employeeId });

        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ message: 'Error processing employee data', error: err.message });
        }
    },
};
