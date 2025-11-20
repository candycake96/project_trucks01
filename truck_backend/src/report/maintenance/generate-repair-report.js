require('dotenv').config();
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');


function replaceAll(template, replacements) {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value || '');
  }
  return result;
}

function generateSystemsHtml(systemsData) {
  if (!systemsData || systemsData.length === 0) return '<p>ไม่มีข้อมูลระบบที่ซ่อม</p>';

  return systemsData.map((sys, systemIndex) => {
    const parts = (sys.part_names || '')
      .split(',')
      .map(name => name.trim())
      .filter(name => name);

    const partItems = parts.map(name => `${name}`).join('');
    const isChecked = partItems ? 'checked' : '';

    return `
     <div style="margin-bottom: 0.5em;">
        <div style="display: flex; align-items: center; gap: 0.5em;">
          <span style="width: 100px;">1.${systemIndex + 1}. ${sys.system_name}:</span>
          <label class="custom-checkbox">
            <input type="checkbox" ${isChecked} />
            <span class="checkmark"></span>
          </label>
          <div style="flex: 1; border-bottom: 1px dashed #000; padding-bottom: 2px;">
            ${partItems || '-'}
          </div>
        </div>
      </div>
    `;
  }).join('');
}


// แปลงวันที่
function formatThaiDateShort(dateStr) {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (isNaN(date)) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear(); // + 543

  return `${day}/${month}/${year}`;
}

// แปลงเวลา
function formatThaiTime(dateStr) {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (isNaN(date)) return '';

  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}


async function generateRepairReport(data, resultRepuests, resultSystems) {
  try {
    const templatePath = path.join(__dirname, '../maintenance/repair-tempage.html');
    let templateHtml = fs.readFileSync(templatePath, 'utf8');

    // ตรวจสอบว่า template มี meta charset แล้วหรือยัง (ถ้ายังให้ใส่)
    if (!templateHtml.includes('<meta charset="UTF-8">')) {
      templateHtml = templateHtml.replace(/<head>/i, '<head><meta charset="UTF-8">');
    }

    const repairData = resultRepuests?.[0] || {};

    // แปลงข้อมูลระบบเป็น HTML
    const systemsHtml = generateSystemsHtml(resultSystems);

    // แทนที่ตัวแปรทั้งหมดใน HTML
    const finalHtml = replaceAll(templateHtml, {
      request_id: repairData.request_id,
      request_informer_emp_id: repairData.request_informer_emp_id,
      request_no: repairData.request_no,
      request_date: formatThaiDateShort(repairData.request_date),
      status: repairData.status,
      created_at: repairData.created_at,
      reg_id: repairData.reg_id,
      car_mileage: repairData.car_mileage,
      request_mileage: repairData.request_mileage,
      request_emp_name: repairData.request_emp_name,
      reg_number: repairData.reg_number,
      branch_name: repairData.branch_name,
      company_name: repairData.company_name,
      company_logo: repairData.company_logo ?  `<img src="${process.env.BASE_URL}/company/imglogo/${repairData.company_logo}" alt="LogoCompany"/>` : ``,
      company_name_en: repairData.company_name_en,
      car_type_name: repairData.car_type_name,
      planning_id: repairData.planning_id,
      planning_emp_id: repairData.planning_emp_id,
      planning_vehicle_availability: repairData.planning_vehicle_availability,
      planning_event_date: formatThaiDateShort(repairData.planning_event_date),
      planning_event_time: formatThaiTime(repairData.planning_event_time),
      planning_event_remarke: repairData.planning_event_remarke,
      planning_created_at_dispatch: formatThaiDateShort(repairData.planning_created_at_dispatch),
      planning_name: repairData.planning_name,
      analysis_id: repairData.analysis_id,
      analysis_date: formatThaiDateShort(repairData.analysis_date),
      analysis_time: formatThaiTime(repairData.analysis_time),
      analysis_remark: repairData.analysis_remark,
      is_quotation_required: repairData.is_quotation_required,
      analysis_emp_id: repairData.analysis_emp_id,
      urgent_repair: repairData.urgent_repair ? 'checked' : '', // ซ่อมด่วนทันที
      inhouse_repair: repairData.inhouse_repair ? 'checked' : '', // 
      send_to_garage: repairData.send_to_garage ? 'checked' : '', // 
      is_pm: repairData.is_pm ? 'checked' : '',
      is_cm: repairData.is_cm ? 'checked' : '',
      analysis_emp_name: repairData.analysis_emp_name,
      approver_id: repairData.approver_id,
      approver_emp_id: repairData.approver_emp_id,
      approver_name: repairData.approver_name,
      position: repairData.position,
      approval_status: repairData.approval_status,
      approval_date: repairData.approval_date,
      analysis_approver_remark: repairData.analysis_approver_remark,
      approver_emp_name: repairData.approver_emp_name,
      approval_id: repairData.approval_id,
      approval_emp_id: repairData.approval_emp_id,
      approval_name: repairData.approval_name,
      approval_status_end: repairData.approval_status_end,
      approval_date_end: repairData.approval_date_end,
      remark_end: repairData.remark_end,
      quotation_id: repairData.quotation_id,
      quotation_vat: repairData.quotation_vat,
      vendor_names_all: repairData.vendor_names_all || '-',
      total_approved_cost: repairData.total_approved_cost,
      total_with_vat: repairData.total_with_vat ? Number(repairData.total_with_vat).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
      systemsName: systemsHtml,
      request_signature: repairData.request_signature  ? `<img src="${process.env.BASE_URL}/uploads/signature/${repairData.request_signature}" alt="ลายเซ็น"/>` : ``,
      planning_signature: repairData.planning_signature  ? `<img src="${process.env.BASE_URL}/uploads/signature/${repairData.planning_signature}" alt="ลายเซ็น"/>` : ``,
      analysis_signature: repairData.analysis_signature  ? `<img src="${process.env.BASE_URL}/uploads/signature/${repairData.analysis_signature}" alt="ลายเซ็น"/>` : ``,
      ana_approver_signature: repairData.ana_approver_signature  ? `<img src="${process.env.BASE_URL}/uploads/signature/${repairData.ana_approver_signature}" alt="ลายเซ็น"/>` : ``,
      request_approver: repairData.request_approver  ? `<img src="${process.env.BASE_URL}/uploads/signature/${repairData.request_approver}" alt="ลายเซ็น"/>` : ``,

      isChecked_Planning_available: repairData.planning_vehicle_availability === 'available' ? 'checked' : '',
      isChecked_Planning_not_available: repairData.planning_vehicle_availability === 'not_available' ? 'checked' : '',
      approval_true: repairData.approval_status_end === 'อนุมัติ' ? 'checked' : '',
      approval_false: repairData.approval_status_end === 'ไม่อนุมัติ' ? 'checked' : '',

    });

    // สร้าง PDF ด้วย Puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(`data:text/html;charset=UTF-8,${encodeURIComponent(finalHtml)}`, {
  waitUntil: 'networkidle0'
});


    const pdfPath = path.join(__dirname, 'repair-report.pdf');
    await page.pdf({ path: pdfPath, format: 'A4' });

    await browser.close();

    return pdfPath;
  } catch (err) {
    console.error('เกิดข้อผิดพลาดขณะสร้างรายงาน:', err);
    throw err;
  }
}

module.exports = generateRepairReport;


