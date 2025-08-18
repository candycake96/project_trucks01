const { executeQueryEmployeeAccessDB } = require('../../../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

module.exports = {

    // shows
    getEmployeesResing: async (req, res) => {
        const query = `SELECT emp.*, p.name_position, d.name_department, b.branch_name
         FROM (((employees emp
        INNER JOIN  positions p ON emp.id_position = p.id_position )
        INNER JOIN departments d ON emp.id_department = d.id_department)
        INNER JOIN branches b ON emp.id_branch = b.id_branch)
        WHERE emp.status != 'Active'
        `;

        try {
            const result = await executeQueryEmployeeAccessDB(query);

            // ตรวจสอบว่า result มีข้อมูลหรือไม่
            if (result && result.length > 0) {
                res.status(200).json(result);  // ส่งข้อมูลในรูปแบบ JSON
            } else {
                res.status(404).json({ message: "No data found in employees table" });
            }

        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).send("Database query failed");
        }
    },

    //เพิ่มข้อมูล
    addEmployees: async (req, res) => {
        const {
            code, fname, lname, nickname, gender, phone, email, date_job,
            id_position, id_department, id_branch, status, password,
        } = req.body;
    
        // คำสั่ง SQL สำหรับการแทรกข้อมูลพนักงาน
        const query = `
            INSERT INTO employees
            (code, fname, lname, nickname, gender, phone, email, date_job,
             id_position, id_department, id_branch, status)
            OUTPUT INSERTED.id_emp
            VALUES (@code, @fname, @lname, @nickname, @gender, @phone, @email, @date_job,
                    @id_position, @id_department, @id_branch, @status);
        `;
    
        const params = {
            code,
            fname,
            lname,
            nickname,
            gender,
            phone,
            email,
            date_job,
            id_position,
            id_department,
            id_branch,
            status
        };
    
        console.log("Insert Parameters:", params); // Debug log
    
        try {
            // Execute query เพื่อแทรกข้อมูลพนักงานและรับ id_emp กลับมา
            const result = await executeQueryEmployeeAccessDB(query, params);
            console.log("Insert Result:", result);
    
            // ตรวจสอบว่าเราได้รับ id_emp ถูกต้อง
            const id_emp = result && result[0]?.id_emp;
    
            if (!id_emp) {
                return res.status(400).json({ message: 'ไม่สามารถดึง ID พนักงานหลังจากการแทรกข้อมูลได้' });
            }
    
            // แฮชรหัสผ่านก่อนการแทรก
            const hashedPassword = await bcrypt.hash(password, 10); // แฮชรหัสผ่านด้วย salt rounds 10
    
            const queryPassword = `
                INSERT INTO password (password, id_emp)
                VALUES (@password, @id_emp);
            `;
    
            const paramsPassword = {
                password: hashedPassword,  // ใช้รหัสผ่านที่แฮชแล้ว
                id_emp  // ใช้ id_emp ที่ได้จากการแทรกข้อมูลพนักงาน
            };
    
            console.log("Insert Parameters for Password:", paramsPassword); // Debug log
            await executeQueryEmployeeAccessDB(queryPassword, paramsPassword);
    
            res.status(200).json({ message: 'เพิ่มพนักงานสำเร็จ' });
    
        } catch (error) {
            console.error("Error inserting employee:", error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มพนักงาน' });
        }
    },


  getEmployeesDriver: async (req, res) => {
    const query = `SELECT * FROM employees WHERE id_position = 4`;
    try {
        const result = await executeQueryEmployeeAccessDB(query);

        // ตรวจสอบว่า result มีข้อมูลหรือไม่
        if (result && result.length > 0) {
            res.status(200).json(result);  // ส่งข้อมูลในรูปแบบ JSON
        } else {
            res.status(404).json({ message: "No data found in employees table" });
        }

    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).send("Database query failed");
    }
  },
    
    
  //เป็นการจัดการ status พนักงาน โดยส่งค่า Active or Niactive
  putEmployeeResign: async (req, res) => {
    const { id } = req.params; // Extract employee ID from request parameters
    const {status} = req.body; // Set the status to 'Inactive'
  
    // Correct SQL query for updating the employee's status
    const query = `UPDATE employees SET status = @status WHERE id_emp = @id_emp`;
  
    try {
      // Execute the query with parameters
      const result = await executeQueryEmployeeAccessDB(query, {
        status: status,
        id_emp: id,
      });
  
      // Check if the update was successful
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "Employee status updated successfully" });
      } else {
        return res.status(404).json({ message: "Employee not found" });
      }
    } catch (error) {
      // Handle errors
      console.error("Error updating employee status:", error);
      return res.status(500).json({ error: "An error occurred while updating the employee's status" });
    }
  }
  


}