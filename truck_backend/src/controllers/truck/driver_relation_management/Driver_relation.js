const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    add_driver_relation: async (req, res) => {
        const { reg_id, assigned_date, assigned_by, notes, id_emp } = req.body;
        try {
                const queriesReg = `INSERT INTO Truck_driver_assignment 
                    (reg_id, driver_id, assigned_date, assigned_by, notes ) 
                    VALUES 
                    (@reg_id, @driver_id, @assigned_date, @assigned_by, @notes)`;

                const valueRelation = {
                    reg_id,
                    driver_id: id_emp,
                    assigned_date,
                    assigned_by,
                    notes
                };

        // Await the result of the query execution
        const result = await executeQueryEmployeeAccessDB(queriesReg, valueRelation);

        if (result && result.affectedRows > 0) { // Assuming the DB returns affectedRows
            res.status(200).json({ message: 'Truck & Driver added Relation successfully' });
        } else {
            res.status(404).json({ message: "No employee found with the provided code" });
        }
    } catch (error) {
        console.error("Database query failed", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล อาจเกิดจากการทำซ้ำในช่วงเวลาเดียวกัน", error: error.message });
    }
},


    shows_driver_relation: async (req, res) => {
        const { id } = req.params;
        const query = `SELECT 
    a.driver_assignment_id, 
    a.reg_id, 
    a.driver_id, 
    a.assigned_date, 
    a.end_date, 
    a.assigned_by, 
    a.notes,
    emp.lname, 
    emp.fname, 
    emp.code,
    emp.phone,
    v.reg_number
FROM Truck_driver_assignment a
INNER JOIN employees emp ON a.driver_id = emp.id_emp
INNER JOIN Truck_vehicle_registration v ON a.reg_id = v.reg_id
WHERE a.reg_id = @reg_id AND a.end_date IS NULL;
`; // ✅ แก้ไข SELECT ให้ถูกต้อง
        const values = { reg_id: id };
        try {
            if (!id) {
                return res.status(400).json({ message: 'ไม่สามารถดึง id พนักงานหลังจากการแทรกข้อมูลได้' });
            }
    
            const result = await executeQueryEmployeeAccessDB(query, values);
            if (result && result.length > 0) {
                res.status(200).json(result);
            } else {
                console.warn("⚠️ ไม่มีข้อมูลในตาราง Truck_driver_assignment");
                res.status(404).json({ message: "No data found in Truck_driver_assignment table" });
            }
    
        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },

    delete_driver_relation: async (req, res) => {
        const { id } = req.params;
        
        // ตรวจสอบว่า id ถูกส่งมา
        if (!id) {
            return res.status(400).json({ message: 'กรุณาระบุ ID ที่ต้องการลบ' });
        }
    
        try {
            // สร้างคำสั่ง SQL สำหรับลบข้อมูลจากตาราง Truck_driver_assignment
            const query = `DELETE FROM Truck_driver_assignment WHERE driver_assignment_id = @driver_assignment_id`;
    
            // ระบุค่าของ id ในคำสั่ง SQL
            const values = { driver_assignment_id: id };
    
            // เรียกใช้ executeQueryEmployeeAccessDB เพื่อประมวลผลคำสั่ง SQL
            const result = await executeQueryEmployeeAccessDB(query, values);
    
            // ถ้ามีการลบข้อมูลสำเร็จ
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'ข้อมูลถูกลบเรียบร้อยแล้ว' });
            } else {
                // หากไม่พบข้อมูลในตาราง
                console.warn("⚠️ ไม่พบข้อมูลที่ตรงกับ ID ที่ต้องการลบ");
                res.status(404).json({ message: "ไม่พบข้อมูลที่ตรงกับ ID ที่ต้องการลบ" });
            }
        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "ไม่สามารถลบข้อมูลได้", error: error.message });
        }
    },

    Cancel_driver_relation: async (req, res) => {
        const { id } = req.params;
        const dateend = new Date(); // สร้างวันที่ใหม่
    
        try {
            const query = `
                UPDATE Truck_driver_assignment 
                SET end_date = @end_date
                WHERE driver_assignment_id = @driver_assignment_id AND end_date IS NULL
            `;
    
            const values = {
                end_date: dateend,
                driver_assignment_id: id
            };
    
            const result = await executeQueryEmployeeAccessDB(query, values);
    
            if (result && result.affectedRows > 0) {
                res.status(200).json({ message: "Driver relation successfully canceled." });
            } else {
                console.warn("⚠️ No matching record found or already canceled.");
                res.status(404).json({ message: "No matching record found to update." });
            }
    
        } catch (error) {
            console.error("Database query failed:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    },
    

    
};

