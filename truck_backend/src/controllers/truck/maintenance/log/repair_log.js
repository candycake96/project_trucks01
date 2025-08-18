const { executeSelectQuery } = require('../../../../config/db');

module.exports = {
  reqair_log_show: async (req, res) => {
    try {
      const { id } = req.params;

      const sql = `
      WITH StatusPriority AS (
        SELECT 'แจ้งซ่อม' AS status, 1 AS priority UNION ALL
        SELECT 'แก้ไข', 2 UNION ALL
        SELECT 'วางแผน', 3 UNION ALL
        SELECT 'วิเคราะห์แผนกซ่อมบำรุง', 4 UNION ALL
        SELECT 'ดำเนินการ', 5
      ),
      LogsWithPriority AS (
        SELECT l.*, p.priority
        FROM Truck_repair_logs l
        JOIN StatusPriority p ON LOWER(LTRIM(RTRIM(l.status))) = LOWER(p.status)
        WHERE l.request_id = @request_id
      ),
      MaxPriority AS (
        SELECT MAX(priority) AS max_priority FROM LogsWithPriority
      ),
      LatestLog AS (
        SELECT TOP 1 *
        FROM LogsWithPriority
        WHERE priority = (SELECT max_priority FROM MaxPriority)
        ORDER BY action_date DESC
      )
      SELECT * FROM LatestLog;
      `;

      const params = { request_id: parseInt(id, 10) };

      const result = await executeSelectQuery(sql, params, true); // เปิด debug ได้ถ้าต้องการ

      if (!result || result.length === 0) {
        return res.status(404).json({ message: "ไม่พบข้อมูล log สำหรับ request นี้" });
      }

      return res.status(200).json({
        message: "ดึงข้อมูล log สำเร็จ",
        data: result[0]
      });

    } catch (error) {
      console.error('Error in reqair_log_show:', error);
      return res.status(500).json({
        message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
        error: error.message
      });
    }
  },
};
