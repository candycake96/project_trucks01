const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    auto_car_add: async (req, res) => {
        try {
            const {id} = req.params;
            const { 
                insurance_company,
                loan_amount,
                interest_rate,
                monthly_payment,
                start_date,
                end_date,
            } = req.body;   
            const value = {
                insurance_company,
                loan_amount,
                interest_rate,
                monthly_payment,
                start_date,
                end_date,
                reg_id: id
            }         
            let query = `INSERT INTO Truck_auto_loans ( insurance_company, loan_amount, interest_rate, monthly_payment, start_date, end_date, reg_id ) 
            VALUES ( @insurance_company, @loan_amount, @interest_rate, @monthly_payment, @start_date, @end_date, @reg_id ) 
            ;`
            const results = await executeQueryEmployeeAccessDB(query, value);
            res.status(200).json({ success: true, message: "Auto Car data added successfully" });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding auto car data.",
            error: error.message,
        });
        }
    }
};


