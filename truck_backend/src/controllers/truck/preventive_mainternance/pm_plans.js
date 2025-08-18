const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
  pm_plans_add_set: async (req, res) => {
    try {
      const { matrix } = req.body;
      const { id } = req.params;

      // ดึงข้อมูลเดิม
      const selectQuery = `
        SELECT item_id, distance_id, is_active
        FROM Truck_maintenance_plan
        WHERE model_id = @model_id
      `;
      const oldRecords = await executeQueryEmployeeAccessDB(selectQuery, { model_id: id });

      const oldRecordMap = new Map();
      oldRecords.forEach(({ item_id, distance_id, is_active }) => {
        const key = `${item_id}-${distance_id}`;
        oldRecordMap.set(key, is_active);
      });

      // ตรวจสอบข้อมูลใหม่ที่ส่งเข้ามา
      for (const item_id of Object.keys(matrix)) {
        const distances = matrix[item_id];

        for (const distance_id of Object.keys(distances)) {
          const key = `${item_id}-${distance_id}`;
          const isChecked = distances[distance_id]; // true หรือ false
          const is_active = isChecked ? 1 : 0;

          
          if (oldRecordMap.has(key)) {
            const old_active = oldRecordMap.get(key);
            if (old_active !== is_active) {
              // ถ้ามีอยู่แล้ว แต่ค่าไม่ตรง → อัปเดต
              const updateQuery = `
                UPDATE Truck_maintenance_plan
                SET is_active = @is_active
                WHERE model_id = @model_id AND item_id = @item_id AND distance_id = @distance_id
              `;
              await executeQueryEmployeeAccessDB(updateQuery, {
                model_id: id,
                item_id,
                distance_id,
                is_active
              });
            }
            // ถ้าค่าเหมือนเดิม → ข้าม
          } else if (isChecked) {
            // ถ้ายังไม่มี → เพิ่มใหม่
            const insertQuery = `
              INSERT INTO Truck_maintenance_plan (model_id, item_id, distance_id, is_active)
              VALUES (@model_id, @item_id, @distance_id, @is_active)
            `;
            await executeQueryEmployeeAccessDB(insertQuery, {
              model_id: id,
              item_id,
              distance_id,
              is_active
            });
          } else {
            // ถ้าเป็น false ไม่ทำอะไรเลย 
          }
        }
      }

      res.status(200).json({ success: true, message: "Maintenance plan updated successfully" });
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating maintenance plan.",
        error: error.message,
      });
    }
  }
};
