const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    auto_car_update: async (req, res) => {
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
                finance_id: id
            }  
            let query = `UPDATE Truck_auto_loans SET  insurance_company = @insurance_company, loan_amount = @loan_amount, interest_rate = @interest_rate, monthly_payment = @monthly_payment, start_date = @start_date, end_date = @end_date
            WHERE  finance_id = @finance_id  `;
            const results = await executeQueryEmployeeAccessDB(query, value);
            res.status(200).json({ success: true, message: "Auto Car data update successfully" });
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


