const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
  pm_plans_details: async (req, res) => {
    try {
      const { id } = req.params;
      const sqlPlans = `SELECT item_id, distance_id FROM Truck_maintenance_plan WHERE model_id = @model_id AND is_active = 1`;
      const value = { model_id: id };

      const results = await executeQueryEmployeeAccessDB(sqlPlans, value);

      // สร้าง structure สำหรับ checkbox
      const matrix = {};

      results.forEach(row => {
        const { item_id, distance_id } = row;

        if (!matrix[item_id]) {
          matrix[item_id] = {};
        }

        matrix[item_id][distance_id] = true;
      });

      res.status(200).json({ success: true, matrix });

    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลแผนการบำรุงรักษา",
        error: error.message,
      });
    }
  }
};
