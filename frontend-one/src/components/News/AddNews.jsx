import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import Details from "./Details";
import API_BASE_URL from '../config/apiConfig'

const AddNews = () => {
  const yourToken = "your_secret_key";
  const [newstitle, setNewstitle] = useState("");
  const [newscontent, setNewscontent] = useState("");
  const [newsimage, setNewsimage] = useState(null); // ใช้ `null` สำหรับไฟล์ภาพ

  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการ reload หน้า
    const formData = new FormData(); // สร้าง FormData object
    formData.append("news_titile", newstitle); // ใส่ข้อมูลหัวข้อข่าวลงใน formData
    formData.append("news_content", newscontent); // ใส่ข้อมูลรายละเอียดข่าวลงใน formData
    if (newsimage) {
      formData.append("news_image", newsimage); // ใส่ไฟล์ภาพลงใน formData
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/newsadd`,
        formData,
        // {
        //   // news_title: newstitle,
        //   // news_content: newscontent,
        //   // news_image: newsimage
        // }
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // ใช้ token ที่เก็บไว
          },
        }
      );
      if (response.status === 200) {
        alert("ข่าวถูกเพิ่มเรียบร้อยแล้ว");
        // รีเซ็ตฟอร์มหลังการส่งข้อมูลสำเร็จ
        setNewstitle("");
        setNewscontent("");
        setNewsimage(null);
      } else {
        alert("เกิดข้อผิดพลาดในการเพิ่มข่าว");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("ข้อมูลไม่ถูกต้องกรุณากรอกข้อมูลให้คลบ");
    }
  };

  return (
    <>
      <div className="p-3">
        <div className="text-center p-3">
          <h2>ข่าว</h2>
        </div>
        <hr />
        <div className="container p-3">
          <form onSubmit={handleSubmit}>
            <div className="col-lg-10">
              <div className="mb-3">
                <label htmlFor="newsTitle" className="form-label">
                  หัวข้อข่าว
                </label>
                <input
                  type="text"
                  name="news_title"
                  className="form-control"
                  id="newsTitle"
                  placeholder="หัวข้อข่าว"
                  value={newstitle}
                  onChange={(e) => setNewstitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newsContent" className="form-label">
                  รายละเอียดข่าว
                </label>
                <textarea
                  name="news_content"
                  className="form-control"
                  id="newsContent"
                  placeholder="รายละเอียดข่าว"
                  rows="3"
                  value={newscontent}
                  onChange={(e) => setNewscontent(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newsImage" className="form-label">
                  เพิ่มรูปภาพ
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="newsImage"
                  onChange={(e) => setNewsimage(e.target.files[0])}
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn  btn-primary">
                  เพิ่มข้อมูลข่าว
                </button>
              </div>
            </div>
          </form>
        </div>
        <hr />
        <div className="container">
          <Details />
        </div>
      </div>
    </>
  );
};

export default AddNews;
