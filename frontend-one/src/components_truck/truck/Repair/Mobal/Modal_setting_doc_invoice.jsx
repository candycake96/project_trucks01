import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { apiUrl } from "../../../../config/apiConfig";
import axios from "axios";

const orderOptions = [
  { value: "1,2,3", label: "ลำดับ - วันที่ - Prefix" },
  { value: "1,3,2", label: "ลำดับ - Prefix - วันที่" },
  { value: "2,1,3", label: "วันที่ - ลำดับ - Prefix" },
  { value: "2,3,1", label: "วันที่ - Prefix - ลำดับ" },
  { value: "3,1,2", label: "Prefix - ลำดับ - วันที่" },
  { value: "3,2,1", label: "Prefix - วันที่ - ลำดับ" },
];

const dateFormats = [
  "dd/mm/yyyy","mm/yyyy","dd/yyyy","yyyy/mm/dd","mm/dd","yyyy/dd","yyyy/mm","mm/yyyy/dd"
];

const ModalSettingDocInvoice = ({ isOpen, onClose }) => {
  const [prefix, setPrefix] = useState("");
  const [sequence, setSequence] = useState(4);
  const [resetType, setResetType] = useState("none");
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");
  const [order, setOrder] = useState("1,2,3");
  const [formatPreview, setFormatPreview] = useState("");

  const generateSequence = (seq, length) => seq.toString().padStart(length, "0");

  const generatePreview = () => {
    const now = new Date();
    let dateStr;
    switch (dateFormat) {
      case "dd/mm/yyyy": dateStr = now.toLocaleDateString("en-GB"); break;
      case "mm/yyyy": dateStr = `${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()}`; break;
      case "dd/yyyy": dateStr = `${now.getDate().toString().padStart(2,'0')}/${now.getFullYear()}`; break;
      case "yyyy/mm/dd": dateStr = `${now.getFullYear()}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getDate().toString().padStart(2,'0')}`; break;
      default: dateStr = now.toLocaleDateString("en-GB");
    }
    const parts = { 1: generateSequence(1, sequence), 2: dateStr, 3: prefix || "PREFIX" };
    setFormatPreview(order.split(",").map(o=>parts[o]).join("-"));
  };

  useEffect(() => { fetchSetting(); }, []);
  useEffect(() => { generatePreview(); }, [prefix, sequence, dateFormat, order]);

  const fetchSetting = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/setting_doc_repair_invoice`, { headers:{ Authorization:`Bearer ${localStorage.getItem("accessToken")}` } });
      const data = Array.isArray(response.data) && response.data.length>0 ? response.data[0]:response.data;
      if(data){
        setPrefix(data.doc_set_prefix||"");
        setSequence(data.seq_number||4);
        setDateFormat(data.date_part||"dd/mm/yyyy");
        setResetType(data.reset_type||"none");
        setOrder(data.doc_order||"1,2,3");
      }
    }catch(err){console.error(err);}
  };

  const handleSave = async () => {
    try{
      await axios.put(`${apiUrl}/api/setting_doc_repair_invoice_update`,
        { doc_set_prefix: prefix, seq_number: sequence, reset_type: resetType, date_part: dateFormat, order },
        { headers:{ Authorization:`Bearer ${localStorage.getItem("accessToken")}` } });
      alert("บันทึกเรียบร้อยแล้ว"); onClose();
    }catch(err){console.error(err); alert("เกิดข้อผิดพลาด");}
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel="ตั้งค่าเลขเอกสาร"
      style={{ content:{ width:"90%", maxWidth:"700px", margin:"auto", padding:"24px", borderRadius:"12px" }, overlay:{ backgroundColor:"rgba(0,0,0,0.5)", zIndex:9999 } }}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-bold">ตั้งค่าเลขเอกสาร</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
      </div>

      {/* Preview */}
      <div className="mb-5">
        <label className="block font-semibold mb-2">ตัวอย่างเลขเอกสาร</label>
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-center py-2 rounded-lg shadow-md">{formatPreview}</div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold mb-1">Prefix</label>
          <input type="text" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400" value={prefix} onChange={e=>setPrefix(e.target.value)} />
        </div>

        <div>
          <label className="block font-semibold mb-1">จำนวนหลักเลข</label>
          <input type="number" min={1} max={10} className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400" value={sequence} onChange={e=>setSequence(parseInt(e.target.value)||1)} />
        </div>

        <div>
          <label className="block font-semibold mb-1">รูปแบบวันที่</label>
          <select className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400" value={dateFormat} onChange={e=>setDateFormat(e.target.value)}>
            {dateFormats.map(f=> <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">ลำดับส่วนประกอบ</label>
          <select className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400" value={order} onChange={e=>setOrder(e.target.value)}>
            {orderOptions.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">รีเซตเลขใหม่</label>
          <select className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400" value={resetType} onChange={e=>setResetType(e.target.value)}>
            <option value="none">ไม่มี</option>
            <option value="daily">ทุกวัน</option>
            <option value="monthly">ทุกเดือน</option>
            <option value="yearly">ทุกปี</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 mt-6 border-t pt-4">
        <button className="bg-gray-500 text-white py-2 px-5 rounded-lg hover:bg-gray-600" onClick={onClose}>ปิด</button>
        <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-5 rounded-lg hover:scale-105 transition-transform" onClick={handleSave}>บันทึก</button>
      </div>
    </ReactModal>
  );
};

export default ModalSettingDocInvoice;
