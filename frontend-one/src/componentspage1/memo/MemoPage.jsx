import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MemoPage = () => {
  const [memoapprover, setMemoapprover] = useState([]); //data to fetchMemoapprover
  const [user, setUser] = useState(null); // data to api ดึงข้อมูลผู้ใช้จาก localStorage
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  
  //useState for input
  const [memoto, setMemoto] = useState("");
  const [memocc, setMemocc] = useState("");
  // const [memofrom, setMemofrom] = useState("");
  // const [typeId, setTypeId] = useState("");
  const [memoSubject, setMemoSubject] = useState("");
  const [memoEnclosure, setMemoEnclosure] = useState("");
  // const [memoNo, setMemoNo] = useState("");
  const [memoDetail, setMemoDetail] = useState("");
  const [memoDetailConsider, setMemoDetailConsider] = useState("");
  const [documentType, setDocumentType] = useState("");

  // แสดงข้อมูล ผู้อนุมัติ
  const fetchMemoapprover = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7071/api/emp_selectuserrole",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMemoapprover(response.data);
    } catch (error) {
      console.error("Error fetching branches: ", error);
    }
  };

  useEffect(() => {
    fetchMemoapprover(); // Fetch branches on component mount
  }, []);

  const currentDate = new Date().toLocaleDateString(); // แสดงผลวันที่ในรูปแบบที่ขึ้นอยู่กับ locale

  // เก็บข้อมูล input แบบ dynamic
  const [rows, setRows] = useState([
    {
      description: "",
      price: "",
      quantity: "",
      total: "",
      vat: "",
      totalvat: "",
    },
  ]);

  //เพิ่มฟังชั่นแถวใหม่
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        description: "",
        price: "",
        quantity: "",
        total: "",
        vat: "",
        totalvat: "",
      },
    ]);
  };

  //ลบแถว
  const handleRemoveRow = (index) => {
    const newRows = rows.filter((row, rowIndex) => rowIndex !== index);
    setRows(newRows);
  };

  // ฟังก์ชันอัพเดทค่าในแต่ละแถว
  const handleInputChange = (index, event) => {
    const newRows = [...rows];
    newRows[index][event.target.name] = event.target.value;

    // คำนวณราคาทันทีเมื่อกรอกข้อมูลในช่อง price หรือ quantity
    if (
      event.target.name === "price" ||
      event.target.name === "quantity" ||
      event.target.name === "vat"
    ) {
      const price = parseFloat(newRows[index].price) || 0;
      const quantity = parseFloat(newRows[index].quantity) || 0;
      const vat = parseFloat(newRows[index].vat) || 0; // ใช้ vat ที่เป็นเปอร์เซ็นต์

      // คำนวณราคารวม
      const total = price * quantity;
      newRows[index].total = total.toFixed(2); // ผลรวม = ราคา * จำนวน

      // คำนวณ VAT ตามเปอร์เซ็นต์ที่กรอก (total * vat%)
      const vatAmount = ((total * vat) / 100).toFixed(2);
      newRows[index].totalvat = vatAmount; // กำหนดค่า VAT ที่คำนวณได้
    }

    setRows(newRows);
  };

  // คำนวณผลรวมทั้งหมดของทุกแถว
  const totalSum = rows.reduce(
    (sum, row) => sum + parseFloat(row.total || 0),
    0
  );
  const totalVatSum = rows.reduce(
    (sum, row) => sum + parseFloat(row.totalvat || 0),
    0
  );

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData)); // แปลง JSON เป็น Object แล้วเก็บใน state
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  const memoData = {
    emp_id: user.id,
    memocc: memocc,
    memoto: memoto,
    memoSubject: memoSubject,
    memoEnclosure: memoEnclosure,
    memoDetail: memoDetail,
    memoDetailConsider: memoDetailConsider,
    documentType: documentType,
    sectionName: user.fname + " " + user.lname,
    purchaseDetails: rows.map(row => ({
      description: row.description,
      price: row.price,
      quantity: row.quantity,
      total: row.total,
      vat: row.vat,
      totalvat: row.totalvat
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page

    if (!memoData) {
      setMessage("Department name is required.");
      setMessageType("error");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:7071/api/insertmemo",
        memoData , 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
    } catch (error) {
      console.error("Error inserting department:", error);
      setMessage("Failed to add department.");
      setMessageType("error");
    }
  };

  return (
    <>
      <div className="container">
        <div className="p-3">
          <div className="">
          <p className="fs-4">create memo!</p>
          </div>
        </div>
      </div>
      <div className="">
        <div className="p-3">
          <form action=""onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header" style={{ background: "#8BADD3" }}>
                <p className="">Create !MEMO</p>
              </div>
              <div className="card-body">
                <div className="">
                {message && (
            <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}>
              {message}
            </div>
          )}
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label htmlFor="sectionName" className="form-label">
                          เลขที่เอกสาร
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="sectionName"
                          placeholder="XXX-XX-XXXX-000"
                          disabled="disabled"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="mb-3">
                        <label htmlFor="sectionName" className="form-label">
                          วันที่สร้างเอกสาร
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="memoid"
                          value={currentDate}
                          disabled="disabled"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="mb-3">
                        <label htmlFor="sectionName" className="form-label">
                          ผู้สร้างเอกสาร
                          <span style={{ color: "red" }}> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="sectionName"
                          defaultValue={user.fname + " " + user.lname}
                          readOnly
                        />
                        {/* ซ่อน input เพื่อส่งค่า emp_id */}
                        <input
                          type="hidden"
                          name="emp_id"
                          value={user.id}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="mb-3">
                        <label
                          htmlFor="departmentSelect"
                          className="form-label"
                        >
                          เรียนถึง คุณ (ผู้อนุมัติขั้นต้น-หัวหน้าแผนก){" "}
                          <span style={{ color: "red" }}> *</span>
                        </label>
                        <select
                          id="memocc"
                          className="form-select"
                          value={memocc}
                          onChange={(e) => setMemocc(e.target.value)}
                        >
                          <option value="">Open this select menu</option>
                          {memoapprover.map((row) => (
                            <option
                              key={row.emp_id}
                              value={row.emp_id}
                            >
                              {row.emp_name} {row.emp_lname}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="mb-3">
                        <label
                          htmlFor="departmentSelect"
                          className="form-label"
                        >
                          เรียนถึง คุณ (ผู้อนุมัติฝ่ายบริหาร){" "}
                          <span style={{ color: "red" }}> *</span>
                        </label>
                        <select
                          id="memoto"
                          className="form-select"
                          value={memoto}
                          onChange={(e) => setMemoto(e.target.value)}
                        >
                          <option value="">Open this select menu</option>
                          {memoapprover.map((row) => (
                            <option
                              key={row.emp_id}
                              value={row.emp_id}
                            >
                              {row.emp_name} {row.emp_lname}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label htmlFor="sectionName" className="form-label">
                        เรื่อง
                        <span style={{ color: "red" }}> *</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="memoSubject"
                          placeholder="นามสกุล"
                          value={memoSubject}
                          onChange={(e) => setMemoSubject(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label htmlFor="memoEnclosure" className="form-label">
                        เอกสารแนบ กรุณารวมเป็น PDF
                        <span style={{ color: "red" }}> *</span>
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="memoEnclosure"
                          placeholder="นามสกุล"
                          value={memoEnclosure}
                          onChange={(e) => setMemoEnclosure(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label htmlFor="memoDetail" className="form-label">
                        รายละเอียด หมายเหตุ
                        <span style={{ color: "red" }}> *</span>
                      </label>
                      <textarea
                        type="text"
                        className="form-control"
                        id="memoDetail"
                          placeholder="นามสกุล"
                          value={memoDetail}
                          onChange={(e) => setMemoDetail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label htmlFor="memoDetailConsider" className="form-label">
                        จึงเรียนมาเพื่อโปรดพิจารณา
                        <span style={{ color: "red" }}> *</span>
                      </label>
                      <textarea
                        type="text"
                        className="form-control"
                        id="memoDetailConsider"
                          placeholder="นามสกุล"
                          value={memoDetailConsider}
                          onChange={(e) => setMemoDetailConsider(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row col-lg-12 mb-3">
                    <label htmlFor="sectionName" className="form-label">
                      กรุณาเลือก
                      <span style={{ color: "red" }}> *</span>
                    </label>
                    <div className="col">
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          name="documentType"
                          id="documentType"
                          value="เพื่อขออนุมัติ"
                          onChange={(e) => setDocumentType(e.target.value)}
                        />
                        <ladel
                          className="foem-check-label"
                          htmlFor="flexRadioDefault1"
                        >
                          เพื่อขออนุมัติ
                        </ladel>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          name="documentType"
                          id="documentType"
                          value="เพื่อลงนาม"
                          onChange={(e) => setDocumentType(e.target.value)}

                        />
                        <ladel
                          className="foem-check-label"
                          htmlFor="flexRadioDefault1"
                        >
                          เพื่อลงนาม
                        </ladel>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          name="documentType"
                          id="documentType"
                          value="เพื่อทราบ"
                          onChange={(e) => setDocumentType(e.target.value)}
                        />
                        <ladel
                          className="foem-check-label"
                          htmlFor="flexRadioDefault1"
                        >
                          เพื่อทราบ
                        </ladel>
                      </div>
                    </div>
                  </div>

                  <hr className="mb-3" />
                  <br />
                  <p className="">รายละเอียดการสังซื้อ (ถ้ามี)</p>

                  <div className="">
                    <div className="">
                      {rows.map((row, index) => (
                        <div className="row mb-3" key={index}>
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label
                                htmlFor="sectionName"
                                className="form-label"
                              >
                                รายละเอีด
                                <span style={{ color: "red" }}> *</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="description"
                                value={row.description}
                                onChange={(e) => handleInputChange(index, e)}
                              />
                            </div>
                          </div>

                          <div className="col-lg-2">
                            <div className="mb-3">
                              <label
                                htmlFor="sectionName"
                                className="form-label"
                              >
                                ราคา : หน่วย
                                <span style={{ color: "red" }}> *</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="price"
                                value={row.price}
                                onChange={(e) => handleInputChange(index, e)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="mb-3">
                              <label
                                htmlFor="sectionName"
                                className="form-label"
                              >
                                จำนวน : หน่วย
                                <span style={{ color: "red" }}> *</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="quantity"
                                value={row.quantity}
                                onChange={(e) => handleInputChange(index, e)}
                              />
                            </div>
                          </div>

                          <div className="col-lg-2">
                            <div className="mb-3">
                              <label
                                htmlFor="sectionName"
                                className="form-label"
                              >
                                ราคารวม (บาท)
                                <span style={{ color: "red" }}> *</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="sectionName"
                                //   placeholder="นามสกุล"
                                name="total"
                                value={row.total}
                              />
                            </div>
                          </div>
                          <div className="col-lg-1">
                            <div className="mb-3">
                              <label
                                htmlFor="sectionName"
                                className="form-label"
                              >
                                VAT %
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="vat"
                                name="vat"
                                value={row.vat}
                                onChange={(e) => handleInputChange(index, e)}
                              />
                            </div>
                          </div>
                          {/*
  <div className="col-2">
    <div className="mb-3">
      <label className="form-label">
        ราคารวม VAT <span style={{ color: "red" }}> *</span>
      </label>
      <input
        type="text"
        className="form-control"
        name="totalvat"
        value={row.totalvat}
        readOnly
      />
    </div>
  </div>
 */}

                          <div className="col-lg-1 mb-3">
                            <label htmlFor="sectionName" className="form-label">
                              <p>
                                <i className="bi bi-trash"></i>
                              </p>
                            </label>
                            <a
                              type="button"
                              onClick={() => handleRemoveRow(index)}
                              className="form-control text-center"
                            >
                              <i className="bi bi-trash"></i>
                            </a>
                          </div>
                        </div>
                      ))}
                      <div className="md-3">
                        <div className="row">
                          <div className="col-lg-8">
                            <div className="">
                              <button
                                type="button"
                                className="btn btn-accent"
                                onClick={handleAddRow}
                              >
                                เพิ่มแถว
                              </button>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <p className="">
                                ราคาไม่รวมภาษีมูลค่าเพิ่ม {totalSum.toFixed(2)}{" "}
                                บาท
                              </p>
                            </div>
                            <div className="mb-3">
                              <p>ภาษีมูลค่าเพิ่ม {totalVatSum.toFixed(2)}</p>
                            </div>
                            <div className="mb-3">
                              <p>
                                รวมราคาสุทธิ{" "}
                                {(totalSum + totalVatSum).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="text-center">
                  <button type="submit" className="btn btn-primary " >ส่งข้อมูล</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MemoPage;
