import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import imagencl from "../images/ship/NCL.jpg"

const About = () => {
  // สร้างออบเจกต์สำหรับสไตล์
  const styles = {
    container: {
      margin: '5rem auto',
      maxWidth: '800px',
    },
    title: {
      color: '#000099',
      textAlign: 'center',
      marginBottom: '1rem',
      fontWeight: 'bold',
      fontSize: '2rem',
    },
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: '1.5rem',
      marginBottom: '0.5rem',
      color: '#000099',
    },
    list: {
      listStyleType: 'none',
      padding: 0,
    },
    listItem: {
      fontSize: '1.25rem',
    },
    contactInfo: {
      textAlign: 'center',
      marginTop: '1rem',
    },
  };

  return (
<>

<div className="p-3">
<div className="">
  <div className="row align-items-center">
    <div className="col-lg-3">
      <h1 style={styles.title}>เกี่ยวกับเรา</h1>
    </div>
    <div className="col-lg-9 d-flex">
      <hr className="flex-grow-1" />
    </div>
  </div>
</div>


    <div style={styles.container}>
    <div className="row">
    <div className="col-md-6">
    <img 
      src={imagencl}
      alt="ภาพเกี่ยวกับบริษัท" 
      className="img-fluid" 
    />
  </div>
  <div className="col-md-6">
    <h2 style={styles.sectionTitle}>ประวัติของบริษัท</h2>
    <p>
      บริษัท เอ็นซีแอล อินเตอร์เนชั่นแนล โลจิสติกส์ จำกัด (มหาชน) 
      ก่อตั้งขึ้นเพื่อให้บริการโลจิสติกส์ที่มีคุณภาพสูง 
      ด้วยความมุ่งมั่นในการสร้างความพึงพอใจให้กับลูกค้า 
      เรามีประสบการณ์ในการให้บริการโลจิสติกส์มากกว่า 20 ปี
    </p>
  </div>
</div>
<br/>

      <div className="row">
        <div className="col-md-6">
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/otL45zkk25k?si=LucSbbZIZ41i3qjU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>        </div>
        <div className="col-md-6">
          <h2 style={styles.sectionTitle}>วิสัยทัศน์และพันธกิจ</h2>
          <p>
            วิสัยทัศน์ของเราคือการเป็นผู้นำด้านโลจิสติกส์ในภูมิภาค 
            โดยให้บริการที่รวดเร็ว ปลอดภัย และมีประสิทธิภาพ 
            พันธกิจของเราคือการสร้างเครือข่ายการขนส่งที่มีความยั่งยืน
          </p>
        </div>
      </div>

      <hr className="my-4" />

      <div className="text-center">
        <h2 style={styles.sectionTitle}>บริการของเรา</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>🚚 การขนส่งสินค้า</li>
          <li style={styles.listItem}>📦 บริการจัดเก็บและจัดการคลังสินค้า</li>
          <li style={styles.listItem}>🛠️ บริการขนส่งแบบครบวงจร</li>
          <li style={styles.listItem}>🌐 โลจิสติกส์ระหว่างประเทศ</li>
        </ul>
      </div>

      <hr className="my-4" />

      <div style={styles.contactInfo}>
        <h2 style={styles.sectionTitle}>ติดต่อเรา</h2>
        <p>หากคุณมีคำถามหรือต้องการข้อมูลเพิ่มเติม โปรดติดต่อเรา:</p>
        <p>📧 Email: contact@nclthailand.com</p>
        <p>📞 โทรศัพท์: +66 2 123 4567</p>
      </div>
    </div>
    </div>
    </>
  );
};

export default About;
