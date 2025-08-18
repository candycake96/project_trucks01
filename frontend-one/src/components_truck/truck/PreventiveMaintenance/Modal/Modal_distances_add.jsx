import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { apiUrl } from "../../../../config/apiConfig";
import { Button } from "react-bootstrap";

const Modal_distances_add = ({ isOpen, onClose, onKmAdded }) => {
    const [distanceKm, setDistanceKm] = useState("");
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null); // 🆕 สำหรับตรวจสอบว่าอยู่ในโหมดแก้ไข


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!distanceKm.trim()) return alert("กรุณากรอกชื่อรายการซ่อม");

        try {
            setLoading(true);
            await axios.post(`${apiUrl}/api/setting_mainternance_distances_add`, {
                distance_km: distanceKm
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            setDistanceKm("");
            await fetchdistanceKm(); // 👈 โหลดระยะทางใหม่ทันที
            onKmAdded?.(); // callback ไป refresh list ด้านนอก
            onClose();
        } catch (err) {
            console.error("เพิ่มข้อมูลล้มเหลว:", err);
            alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
        } finally {
            setLoading(false);
        }
    };

    const [distanceKmTable, setDistanceKmTable] = useState([]);
    const fetchdistanceKm = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/setting_mainternance_distances_show`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setDistanceKmTable(response.data);
        } catch (error) {
            console.error("Error fetching distance: ", error);
        }
    };

    useEffect(() => {
        fetchdistanceKm();
    }, []);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="เพิ่มข้อมูลรายการซ่อม"
            style={{
                content: {
                    width: "100%",
                    maxWidth: "650px",
                    height: "auto",
                    margin: "auto",
                    padding: "0",
                    border: "none",
                    borderRadius: "0.5rem",
                    overflowY: "auto",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
            }}
        >
            <div className="modal-header bg-light p-3">
                <h5 className="modal-title fw-bold mb-0">เพิ่มข้อมูลระยะทางใช้ในสการซ่อม</h5>
                <button
                    onClick={onClose}
                    className="btn-close"
                    style={{ position: "absolute", right: "1rem", top: "1rem" }}
                />
            </div>

            <form onSubmit={handleSubmit} className="p-4">
                <div className="mb-3">
                    <label className="form-label">ระยะทาง</label>
                    <input
                        type="number"
                        className="form-control"
                        value={distanceKm}
                        onChange={(e) => setDistanceKm(e.target.value)}
                        placeholder=" 0000"
                        required
                    />
                </div>

                <div className="text-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                        ยกเลิก
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "กำลังบันทึก..." : "บันทึก"}
                    </button>
                </div>
            </form>

            <div className="p-3">

                <table className="table">
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>ระยะ</th>
                            <th><i class="bi bi-pencil-square"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {distanceKmTable.map((data, ndx) => (
                            <tr key={data.id}>
                                <td>{ndx + 1}</td>
                                <td>{data.distance_km} กม.</td>
                                <td className="text-end">
                                    <Button className="btn btn-sm">
                                        <i className="bi bi-pencil-square"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </ReactModal>
    );
};

export default Modal_distances_add;
