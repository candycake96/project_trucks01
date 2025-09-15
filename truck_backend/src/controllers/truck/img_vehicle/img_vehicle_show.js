const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
  img_vehicle_show: async (req, res) => {
    const { id } = req.params; // id รถ

    try {
      const query = `
        SELECT * 
        FROM Truck_vehicle_img 
        WHERE reg_id = @reg_id
      `;

      const result = await executeQueryEmployeeAccessDB(query, { reg_id: id });

      if (result && result.length > 0) {
        // สร้าง URL ให้แต่ละรูป
        const fileUrl = result.map(img => ({
          ...img,
          img_url: `${req.protocol}://${req.get("host")}/api/uploads/vehicle_img/${img.img_name}`
        }));

        return res.status(200).json({ images: fileUrl });
      } else {
        return res.status(404).json({ message: "No images found" });
      }
    } catch (error) {
      console.error("Fetch Image Error:", error);
      res.status(500).json({ message: "Error fetching image", error: error.message });
    }
  }
};
