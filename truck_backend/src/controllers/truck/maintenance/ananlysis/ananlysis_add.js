const { executeQueryEmployeeAccessDB } = require('../../../../config/db');
const sql = require('mssql');

module.exports = {
  ananlysis_add: async (req, res) => {
    try {
      // ----------------------------
      // Utility functions
      // ----------------------------
      const clean = (v) => {
        if (v === undefined || v === null) return null;
        if (typeof v === "string") return v.trim();
        return v;
      };

      const toBit = (val) => val === '1' || val === 1 || val === true ? 1 : 0;
      const toNumber = (val) => val !== null && val !== undefined && val !== '' ? Number(val) : null;

      // ----------------------------
      // Validate main ID
      // ----------------------------
      const id = toNumber(req.params.id);
      if (isNaN(id)) throw new Error("Invalid request ID");

      // ----------------------------
      // Validate analysis_emp_id
      // ----------------------------
      const analysis_emp_id = req.body.analysis_emp_id ? toNumber(req.body.analysis_emp_id) : null;
      if (analysis_emp_id !== null && isNaN(analysis_emp_id)) throw new Error("Invalid analysis_emp_id");

      console.log("Received request ID:", id);
      console.log("Received analysis_emp_id:", analysis_emp_id);
      console.log("Body:", req.body);
      console.log("Files:", req.files);

      // ----------------------------
      // Parse quotations array
      // ----------------------------
      let quotations = [];
      if (typeof req.body.quotations === "string") {
        try {
          quotations = JSON.parse(req.body.quotations);
        } catch (err) {
          throw new Error("Invalid quotations JSON format");
        }
      } else if (Array.isArray(req.body.quotations)) {
        quotations = req.body.quotations;
      }

      // Attach uploaded files to quotations[]
      req.files?.forEach((file) => {
        const match = file.fieldname.match(/^quotations\[(\d+)\]\[quotation_file\]$/);
        if (match) {
          const idx = Number(match[1]);
          if (quotations[idx]) quotations[idx].quotation_file = file.filename;
        }
      });

      // ----------------------------
      // Insert Truck_repair_analysis
      // ----------------------------
      const sqlAnalysis = `
        INSERT INTO Truck_repair_analysis (
          request_id, plan_date, remark, is_quotation_required, analysis_emp_id,
          urgent_repair, inhouse_repair, send_to_garage, is_pm, is_cm, plan_time
        )
        OUTPUT INSERTED.analysis_id
        VALUES (
          @request_id, @plan_date, @remark, @is_quotation_required, @analysis_emp_id,
          @urgent_repair, @inhouse_repair, @send_to_garage, @is_pm, @is_cm, @plan_time
        );
      `;

      const analysisParams = {
        request_id:           { type: sql.Int, value: id },
        analysis_emp_id:      { type: sql.Int, value: analysis_emp_id },
        plan_date:            { type: sql.NVarChar, value: clean(req.body.plan_date) },
        plan_time:            { type: sql.NVarChar, value: clean(req.body.plan_time) },
        remark:               { type: sql.NVarChar, value: clean(req.body.remark) },
        is_pm:                { type: sql.Bit, value: toBit(req.body.is_pm) },
        is_cm:                { type: sql.Bit, value: toBit(req.body.is_cm) },
        is_quotation_required:{ type: sql.Bit, value: toBit(req.body.is_quotation_required) },
        urgent_repair:        { type: sql.Bit, value: toBit(req.body.urgent_repair) },
        inhouse_repair:       { type: sql.Bit, value: toBit(req.body.inhouse_repair) },
        send_to_garage:       { type: sql.Bit, value: toBit(req.body.send_to_garage) },
      };

      console.log("Analysis Params:", analysisParams);

      const resultAnalysis = await executeQueryEmployeeAccessDB(sqlAnalysis, analysisParams);
      if (!resultAnalysis || !resultAnalysis[0]?.analysis_id) {
        throw new Error("Failed to insert Truck_repair_analysis");
      }
      const analysis_id = resultAnalysis[0].analysis_id;
      console.log("Inserted analysis_id:", analysis_id);

      // ----------------------------
      // Insert Truck_repair_garage_quotation
      // ----------------------------
      const sqlQuotation = `
        INSERT INTO Truck_repair_garage_quotation (
          analysis_id, vendor_id, quotation_file, quotation_date,
          quotation_vat, note, is_selected, vendor_name
        ) OUTPUT INSERTED.quotation_id
        VALUES (
          @analysis_id, @vendor_id, @quotation_file, @quotation_date,
          @quotation_vat, @note, @is_selected, @vendor_name
        );
      `;

      const sqlParts = `
        INSERT INTO Truck_repair_quotation_parts (
          item_id, quotation_id, part_id, part_name,
          maintenance_type, part_price, part_vat, part_unit, part_qty
        )
        VALUES (
          @item_id, @quotation_id, @part_id, @part_name,
          @maintenance_type, @part_price, @part_vat, @part_unit, @part_qty
        );
      `;

      for (const [idx, quotation] of quotations.entries()) {
        const quotationParams = {
          analysis_id:    { type: sql.Int, value: analysis_id },
          vendor_id:      { type: sql.Int, value: toNumber(quotation.vendor_id) },
          quotation_file: { type: sql.NVarChar, value: clean(quotation.quotation_file) },
          quotation_date: { type: sql.NVarChar, value: clean(quotation.quotation_date) },
          quotation_vat:  { type: sql.Decimal, precision: 10, scale: 2, value: toNumber(quotation.quotation_vat) || 0 },
          note:           { type: sql.NVarChar, value: clean(quotation.note) },
          is_selected:    { type: sql.Bit, value: toBit(quotation.is_selected) },
          vendor_name:    { type: sql.NVarChar, value: clean(quotation.vendor_name) },
        };

        console.log(`Quotation Params[${idx}]:`, quotationParams);

        const resultQuo = await executeQueryEmployeeAccessDB(sqlQuotation, quotationParams);
        if (!resultQuo || !resultQuo[0]?.quotation_id) {
          throw new Error(`Failed to insert quotation at index ${idx}`);
        }

        const quotation_id = resultQuo[0].quotation_id;
        console.log(`Inserted quotation_id[${idx}]:`, quotation_id);

        // ----------------------------
        // Insert parts
        // ----------------------------
        if (quotation.parts && Array.isArray(quotation.parts)) {
          for (const [pIdx, part] of quotation.parts.entries()) {
            const partParams = {
              item_id:          { type: sql.Int, value: toNumber(part.item_id) },
              quotation_id:     { type: sql.Int, value: quotation_id },
              part_id:          { type: sql.NVarChar, value: clean(part.part_id) },
              part_name:        { type: sql.NVarChar, value: clean(part.part_name) },
              maintenance_type: { type: sql.NVarChar, value: clean(part.maintenance_type) },
              part_price:       { type: sql.Decimal, precision: 10, scale: 2, value: toNumber(part.price) || 0 },
              part_vat:         { type: sql.Decimal, precision: 10, scale: 2, value: toNumber(part.vat) || 0 },
              part_unit:        { type: sql.NVarChar, value: clean(part.unit) },
              part_qty:         { type: sql.Int, value: toNumber(part.qty) || 0 },
            };

            console.log(`Part Params[${idx}][${pIdx}]:`, partParams);

            await executeQueryEmployeeAccessDB(sqlParts, partParams);
          }
        }
      }

      // ----------------------------
      // Update request status
      // ----------------------------
      await executeQueryEmployeeAccessDB(
        `UPDATE Truck_repair_requests 
         SET status = @status 
         WHERE request_id = @request_id`,
        {
          status:     { type: sql.NVarChar, value: "ตรวจเช็ครถ" },
          request_id: { type: sql.Int, value: id },
        }
      );

      // ----------------------------
      // Insert log
      // ----------------------------
      await executeQueryEmployeeAccessDB(
        `INSERT INTO Truck_repair_logs (
          request_id, action, action_by, action_by_role, status, remarks
        ) VALUES (
          @request_id, @action, @action_by, @action_by_role, @status, @remarks
        )`,
        {
          request_id:     { type: sql.Int, value: id },
          action:         { type: sql.NVarChar, value: 'วิเคราะห์แผนกซ่อมบำรุง' },
          action_by:      { type: sql.Int, value: analysis_emp_id },
          action_by_role: { type: sql.NVarChar, value: 'แผนกช่าง' },
          status:         { type: sql.NVarChar, value: 'วิเคราะห์แผนกซ่อมบำรุง' },
          remarks:        { type: sql.NVarChar, value: 'วิเคราะห์แผนกซ่อมบำรุง' },
        }
      );

      res.status(200).json({
        message: "Analysis added successfully",
        quotations
      });

    } catch (error) {
      console.error("Database query failed:", error);
      res.status(500).json({
        message: "Database query failed",
        error: error.message,
      });
    }
  },
};
