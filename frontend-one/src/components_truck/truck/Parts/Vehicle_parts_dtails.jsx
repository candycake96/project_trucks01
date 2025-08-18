import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Modal_vehicle_parts_add from "./Modal/Modal_vehicle_parts_add";
import Modal_vehicle_systems from "./Modal/Modal_vehicle_systems";
import axios from "axios";
import { apiUrl } from "../../../config/apiConfig";
import Modal_vehicle_part_edit from "./Modal/Modal_vehicle_parts_edit";

const Vehicle_parts_details = () => {
    const [reload, setReload] = useState(false); // Reload when `reload` changes

    const [isDataParts, setDataParts] = useState([]);
    const [isOpenModalParteAdd, setOpenModalPartsAdd] = useState(false);
    const [isOpenModalVehicleSystems, setOpenModalVehicleSystems] = useState(false);
    const [isOpenModalPartsEdit, setOpenModalPartsEdit] = useState(false);
    const [isDataModalPartsEdit, setDataModalPartsEdit] = useState(null);
    const [isSystemSearch, setSystemSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 20;

    const handleOpenModalVehicleSystems = () => setOpenModalVehicleSystems(true);
    const handleClossModalVehicleSystems = () => setOpenModalVehicleSystems(false);
    const handleOpenModalPartsAdd = () => setOpenModalPartsAdd(true);
    const handleClossModalpartsAdd = () => setOpenModalPartsAdd(false);
    const handleOpenModalPartsEdit = (data) => { setOpenModalPartsEdit(true); setDataModalPartsEdit(data) };
    const handleClossModalPartsEdit = () => setOpenModalPartsEdit(false);
    const [isSystemsShow, setSystemsShow] = useState([]);

    const fetchSystemsShows = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/systems_show_all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setSystemsShow(response.data);
        } catch (error) {
            console.error("Error fetching coverage type:", error);
        }
    };

    useEffect(() => {
        fetchSystemsShows();
    }, []);


    const fetchPartsShow = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/parts_show_all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setDataParts(response.data);
        } catch (error) {
            console.error("Error fetching parts:", error);
        }
    };

    useEffect(() => {
        fetchPartsShow();
    }, [reload]);

    // ค้นหาอะไหล่ตามชื่อ
    const filteredData = isDataParts.filter((row) => {
        return (
            row.system_name.toLowerCase().includes(isSystemSearch.toLowerCase()) &&
            (
                row.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.part_code.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    });


    // Pagination
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = filteredData.slice(offset, offset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0); // รีเซ็ตหน้าเมื่อพิมพ์ค้นหา
    };


    const handleDelete = async (id) => {
        if (!window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?\nการลบอาจมีผลกระทบกับเอกสารหรือข้อมูลอื่นที่เกี่ยวข้อง")) return;
        try {
            const response = await axios.delete(`${apiUrl}/api/part_delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            alert(response.data.message || "ลบสำเร็จ");
            fetchPartsShow();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการลบ");
        }
    };

    const handleSystemsChande = (e) => {
        setSystemSearch(e.target.value);
    };

    return (
        <>
            <div className="container">
                <div className="p-3">
                    <div className="mb-2 d-flex justify-content-between align-items-center">
                        <p className="fw-bolder fs-5">ข้อมูลราคากลางอะไหล่</p>
                        <button className="btn btn-primary" onClick={handleOpenModalVehicleSystems}>
                            เพิ่มข้อมูลระบบ 
                        </button>
                    </div>

                    <hr className="mb-3" />

                    <div className="mb-3 col-12">
                        <div className="d-flex flex-nowrap align-items-center gap-2">
                            <select className="form-select form-select-sm" style={{ width: "200px" }} onChange={handleSystemsChande}>
                                <option value="">หมวดหมู่ระบบ (ทั้งหมด)</option>
                                {isSystemsShow.map((row, index) => (

                                    <option key={index} value={row.system_name}>{row.system_name}</option>

                                ))}
                            </select>

                            <div className="input-group input-group-sm" style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ค้นหาอะไหล่..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <button className="btn btn-outline-secondary" type="button">
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>

                            <button className="btn btn-primary btn-sm" onClick={handleOpenModalPartsAdd}>
                                <i className="bi bi-plus me-1"></i> เพิ่มข้อมูลอะไหล่
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="card">
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>รหัส</th>
                                            <th>ระบบ</th>
                                            <th>อะไหล่</th>
                                            <th>หน่วย</th>
                                            <th>ยี่ห้อ</th>
                                            <th>รุ่น</th>
                                            <th>ราคา</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.part_code}</td>
                                                <td>{row.system_name}</td>
                                                <td>{row.part_name}</td>
                                                <td>{row.unit}</td>
                                                <td>{row.brand}</td>
                                                <td>{row.model}</td>
                                                <td>{row.price}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-primary rounded-circle me-1" onClick={() => handleOpenModalPartsEdit(row)} ><i class="bi bi-pencil-square"></i></button>
                                                    <button className="btn btn-sm btn-outline-primary rounded-circle me-1" onClick={() => handleDelete(row.part_id)} ><i className="bi bi-trash3-fill"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {currentItems.length === 0 && (
                                            <tr>
                                                <td colSpan="8" className="text-center">
                                                    ไม่พบข้อมูล
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <ReactPaginate
                                    previousLabel={"<"}
                                    nextLabel={">"}
                                    breakLabel={"..."}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={1}
                                    pageRangeDisplayed={3}
                                    onPageChange={handlePageClick}
                                    containerClassName={"pagination pagination-sm justify-content-center"}  // เพิ่ม pagination-sm
                                    pageClassName={"page-item"}
                                    pageLinkClassName={"page-link"}
                                    previousClassName={"page-item"}
                                    previousLinkClassName={"page-link"}
                                    nextClassName={"page-item"}
                                    nextLinkClassName={"page-link"}
                                    activeClassName={"active"}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isOpenModalParteAdd && (
                <Modal_vehicle_parts_add isOpen={isOpenModalParteAdd} onClose={handleClossModalpartsAdd} onSuccess={() => setReload(prev => !prev)} />
            )}
            {isOpenModalVehicleSystems && (
                <Modal_vehicle_systems isOpen={isOpenModalVehicleSystems} onClose={handleClossModalVehicleSystems} />
            )}
            {isOpenModalPartsEdit &&
                <Modal_vehicle_part_edit isOpen={isOpenModalPartsEdit} onClose={handleClossModalPartsEdit} onData={isDataModalPartsEdit} onSuccess={() => setReload(prev => !prev)} />
            }
        </>
    );
};

export default Vehicle_parts_details;
