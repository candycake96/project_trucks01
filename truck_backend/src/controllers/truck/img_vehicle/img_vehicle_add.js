const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
  img_vehicle_add: async (req, res) => {
    const { id } = req.params; // id รถ
    const files = req.files;   // array ของไฟล์ทั้งหมด

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
      for (let file of files) {
        const imgName = file.filename;
        const query = `
          INSERT INTO Truck_vehicle_img (reg_id, img_name)
          VALUES (@reg_id, @img_name)
        `;
        await executeQueryEmployeeAccessDB(query, {
          reg_id: id,
          img_name: imgName
        });
      }

      res.json({
        message: 'Upload successful',
        files: files.map(f => f.filename)
      });
    } catch (error) {
      console.error('DB Insert Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};
