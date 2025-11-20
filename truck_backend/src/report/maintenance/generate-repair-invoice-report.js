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

function formatThaiDateShort(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// ✅ ฟังก์ชันตัดข้อความ note ให้ตกบรรทัดตามความยาวที่กำหนด
function splitTextIntoLines(text, maxLength = 80) {
    if (!text) return [];
    const words = text.split(' ');
    const lines = [];
    let line = '';

    for (const word of words) {
        if ((line + word).length > maxLength) {
            lines.push(line.trim());
            line = word + ' ';
        } else {
            line += word + ' ';
        }
    }
    if (line.trim() !== '') lines.push(line.trim());
    return lines;
}

async function generateRepairReport({ invoice, sections }) {
    try {
        const templatePath = path.join(__dirname, '../maintenance/repair-tempage-invoice.html');
        let templateHtml = fs.readFileSync(templatePath, 'utf8');

        const replacedHtml = replaceAll(templateHtml, {
            invoice_no: invoice.invoice_no || '',
            invoice_date: formatThaiDateShort(invoice.invoice_date),
            created_fname: invoice.created_fname || '',
            created_lname: invoice.created_lname || '',
            approved_fname: invoice.approved_fname || '',
            approved_lname: invoice.approved_lname || '',
            branch_name: invoice.branch_name || '',
            invoice_approver_date: formatThaiDateShort(invoice.approval_date)
        });

        let sectionHtml = '';
        let totalQty = 0;
        let totalBeforeVat = 0;
        let totalVat = 0;
        let grandTotal = 0;

        sections.forEach((section, i) => {
            const noteLines = splitTextIntoLines(section.note, 80);

            // ✅ แสดง note หลายบรรทัด โดยมีเส้นครบทุกช่อง
            noteLines.forEach((line, idx) => {
                sectionHtml += `
                <tr>
                    <td style="border:1px solid black; text-align:center;">${idx === 0 ? i + 1 : ''}</td>
                    <td style="border:1px solid black;">${line}</td>
                    <td style="border:1px solid black;"></td>
                    <td style="border:1px solid black;"></td>
                    <td style="border:1px solid black;"></td>
                    <td style="border:1px solid black;"></td>
                </tr>
                `;
            });

            // ✅ loop แสดง parts
            section.parts.forEach(part => {
                const qty = part.part_qty || 0;
                const price = part.part_price || 0;
                const discount = part.part_discount || 0;
                const vatRate = part.part_vat || 0;

                const totalBeforeVatItem = qty * price - discount;
                const vatAmount = (totalBeforeVatItem * vatRate) / 100;
                const totalWithVat = totalBeforeVatItem + vatAmount;

                totalQty += qty;
                totalBeforeVat += totalBeforeVatItem;
                totalVat += vatAmount;
                grandTotal += totalWithVat;

                sectionHtml += `
                <tr>
                    <td style="border:1px solid black;"></td>
                    <td style="border:1px solid black;">${part.part_name}</td>
                    <td style="border:1px solid black; text-align:center;">${qty}</td>
                    <td style="border:1px solid black; text-align:right;">${price.toFixed(2)}</td>
                    <td style="border:1px solid black; text-align:center;">${discount.toFixed(2)}</td>
                    <td style="border:1px solid black; text-align:right;">${totalBeforeVatItem.toFixed(2)}</td>
                </tr>
                `;
            });

            // ✅ แถวเว้นระหว่าง section (ยังคงมีเส้น)
            sectionHtml += `
            <tr>
                <td style="border:1px solid black;">&nbsp;</td>
                <td style="border:1px solid black;">&nbsp;</td>
                <td style="border:1px solid black;">&nbsp;</td>
                <td style="border:1px solid black;">&nbsp;</td>
                <td style="border:1px solid black;">&nbsp;</td>
                <td style="border:1px solid black;">&nbsp;</td>
            </tr>
            `;
        });

        // ✅ รวมยอดท้ายตาราง
        sectionHtml += `
        <tfoot>
            <tr>
                <td colspan="5" style="border:1px solid black; text-align:right;"><b>รวม</b></td>
                <td style="border:1px solid black; text-align:right;"><b>${totalBeforeVat.toFixed(2)}</b></td>
            </tr>
            <tr>
                <td colspan="5" style="border:1px solid black; text-align:right;"><b>VAT 7%</b></td>
                <td style="border:1px solid black; text-align:right;">${totalVat.toFixed(2)}</td>
            </tr>
            <tr>
                <td colspan="5" style="border:1px solid black; text-align:right;"><b>รวมเงินทั้งหมด</b></td>
                <td style="border:1px solid black; text-align:right;"><b>${grandTotal.toFixed(2)}</b></td>
            </tr>
        </tfoot>
        `;

        const finalHtml = replacedHtml.replace('{{section_rows}}', sectionHtml);

        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

        const timestamp = Date.now();
        const pdfPath = path.join(__dirname, `repair-report-${timestamp}.pdf`);
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
        });

        await browser.close();
        return pdfPath;

    } catch (err) {
        console.error('เกิดข้อผิดพลาดขณะสร้างรายงาน:', err);
        throw err;
    }
}

module.exports = generateRepairReport;
