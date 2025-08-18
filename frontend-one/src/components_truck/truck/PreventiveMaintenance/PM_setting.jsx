import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Modal_item_add from "./Modal/Modal_item_add";
import { apiUrl } from "../../../config/apiConfig";
import axios from "axios";
import Modal_distances_add from "./Modal/Modal_distances_add";

const PM_setting = () => {
  const location = useLocation();
  const isRowModelsData = location.state || {};

  const [isItemData, setItemData] = useState([]);
  // const distances = [1000, 2000, 3000, 4000];

  const [pmMatrix, setPmMatrix] = useState({});
  const [distanceData, setDistanceData] = useState([]);
  // ดึงรายการจาก backend
  const fetchItemList = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/setting_mainternance_item_show`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setItemData(response.data);
    } catch (error) {
      console.error("Error fetching Item: ", error);
    }
  };

  useEffect(() => {
    fetchItemList();
  }, []);


  const fetchdistance = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/setting_mainternance_distances_show`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setDistanceData(response.data);
    } catch (error) {
      console.error("Error fetching distance: ", error);
    }
  };

  useEffect(() => {
    fetchdistance();
  }, []);

    useEffect(() => {
  axios.get(`${apiUrl}/api/pm_plans_details/${isRowModelsData?.model_id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }
  })
  .then((res) => {
    setPmMatrix(res.data.matrix); // set state
  })
  .catch((err) => {
    console.error('โหลดข้อมูลผิดพลาด', err);
  });
}, []);


  // อัปเดต pmMatrix โดยไม่ลบค่าที่ติ๊กไว้เดิม
  useEffect(() => {
    if (isItemData.length > 0 && distanceData.length > 0) {
      setPmMatrix((prevMatrix) => {
        const newMatrix = { ...prevMatrix };

        isItemData.forEach((item) => {
          if (!newMatrix[item.item_id]) {
            newMatrix[item.item_id] = {};
            distanceData.forEach((km) => {
              newMatrix[item.item_id][km.distance_id] = false;
            });
          }
        });

        return newMatrix;
      });
    }
  }, [isItemData, distanceData]);


  // toggle checkbox
const toggleCheckbox = (itemId, distanceId) => {
  setPmMatrix((prev) => {
    const currentItem = prev[itemId] || {};
    return {
      ...prev,
      [itemId]: {
        ...currentItem,
        [distanceId]: !currentItem[distanceId],
      },
    };
  });
};



  // บันทึก PM Matrix
  // const handleSubmit = () => {
  //   const filteredMatrix = {};

  //   for (const itemId in pmMatrix) {
  //     const distanceChecks = pmMatrix[itemId];
  //     const filteredDistances = {};

  //     for (const distanceId in distanceChecks) {
  //       if (distanceChecks[distanceId] === true) {
  //         filteredDistances[distanceId] = true;
  //       }
  //     }

  //     if (Object.keys(filteredDistances).length > 0) {
  //       filteredMatrix[itemId] = filteredDistances;
  //     }
  //   }

  //   console.log('ส่งข้อมูล:', filteredMatrix);

  //   // ส่ง filteredMatrix ไปยัง backend
  //   axios.post(`${apiUrl}/api/pm_plans_add_set/${isRowModelsData?.model_id}`,
  //     { matrix: filteredMatrix },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     }
  //   )
  //     .then((res) => {
  //       console.log('สำเร็จ:', res.data);
  //        alert('บันทึกข้อมูลสำเร็จ!');
  //     })
  //     .catch((err) => {
  //       console.error('ผิดพลาด:', err);
  //       alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
  //     });
  // };

  const handleSubmit = () => {
  console.log('ส่งข้อมูลทั้งหมด:', pmMatrix);

  axios.post(`${apiUrl}/api/pm_plans_add_set/${isRowModelsData?.model_id}`,
    { matrix: pmMatrix },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  )
    .then((res) => {
      console.log('สำเร็จ:', res.data);
      alert('บันทึกข้อมูลสำเร็จ!');
    })
    .catch((err) => {
      console.error('ผิดพลาด:', err);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
    });
};


  const [isOpenModalItemAdd, setOpenModalItemAdd] = useState(false);
  const handleOpenModalItemAdd = () => setOpenModalItemAdd(true);
  const handleClosModalItemAdd = () => setOpenModalItemAdd(false);

  const [isOpenModaldistancesAdd, setOpenModaldistancesAdd] = useState(false);
  const handleOpenModaldistancesAdd = () => setOpenModaldistancesAdd(true);
  const handleClosModaldistancesAdd = () => setOpenModaldistancesAdd(false);




  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0"><i className="bi bi-gear-fill me-2"></i>ตั้งค่าแผน PM</h5>
          <div>
            <Button variant="light" size="sm" className="me-2" onClick={handleOpenModalItemAdd}>
              <i className="bi bi-plus-circle me-1"></i> รายการ
            </Button>
            <Button variant="light" size="sm" onClick={handleOpenModaldistancesAdd}>
              <i className="bi bi-plus-circle me-1"></i> ระยะทาง
            </Button>
          </div>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <p><strong>รุ่น :</strong> {isRowModelsData?.model}</p>
            <p><strong>ยี่ห้อ :</strong> {isRowModelsData?.brand}</p>
            <p><strong>ทะเบียนรถที่เกี่ยวข้อง :</strong> {isRowModelsData?.reg_numbers}</p>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered text-center align-middle">
              <thead className="table-secondary">
                <tr>
                  <th>รายการ</th>
                  {distanceData.map((km) => (
                    <th key={km.distance_id}>{km.distance_km} กม.</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isItemData.map((item) => (
                  <tr key={item.item_id}>
                    <td className="text-start fw-semibold">{item.item_name}</td>
                    {distanceData.map((km) => (
                      <td key={km.distance_id}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={pmMatrix?.[item.item_id]?.[km.distance_id] || false}
                          onChange={() => toggleCheckbox(item.item_id, km.distance_id)}
                        />

                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="text-end mt-3">
            <Button variant="success" onClick={handleSubmit}>
              <i className="bi bi-save me-2"></i>บันทึกแผน PM
            </Button>
          </div>
        </div>
      </div>

      {isOpenModalItemAdd && (
        <Modal_item_add
          isOpen={isOpenModalItemAdd}
          onClose={handleClosModalItemAdd}
          onItemAdded={fetchItemList}
        />
      )}

      {isOpenModaldistancesAdd && (
        <Modal_distances_add
          isOpen={isOpenModaldistancesAdd}
          onClose={handleClosModaldistancesAdd}
          onKmAdded={fetchdistance}
        />
      )}
    </div>

  );
};

export default PM_setting;
