const express = require("express");
const router = express.Router();
const { executeQuery } = require("../src/db");

router.get("/", async (req, res) => {
    try {
        const query = "SELECT * FROM car_type";
        const students = await executeQuery(query);
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Error fetching students" });
    }
});

module.exports = { router };
