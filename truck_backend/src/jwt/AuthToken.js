const jwt = require("jsonwebtoken");  // แก้ไขจาก reqiure เป็น require

// คีย์ลับสำหรับเซ็นโทเค็น (เก็บไว้อย่างปลอดภัย เช่นใน ENV)
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";  // แนะนำให้ใช้ .env แทนการใช้คีย์ตรงๆ

// ฟังก์ชันสำหรับสร้างโทเค็น
const generateToken = (payload, expiresIn = "1day") => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// ฟังก์ชันสำหรับตรวจสอบโทเค็น
const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

// Middleware สำหรับป้องกันเส้นทางที่ต้องการการยืนยันตัวตน
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // เก็บข้อมูล payload ของโทเค็นใน `req.user`
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
};



