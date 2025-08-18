import axios from "axios";
import React, { useEffect, useState } from "react";

const MemoDetails = () => {
  const [memo, setMemo] = useState([]);
  const [user, setUser] = useState(null);

  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData)); // แปลง JSON เป็น Object แล้วเก็บใน state
    }
  }, []);

  const fetchMemo = async () => {
    try {
      const response = await axios.get("http://localhost:7071/api/selectmemo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Check if the response structure is as expected
      if (response.data && response.data.status === "ok") {
        // Receive and sort data here
        const sortedMemos = response.data.data.sort(
          (a, b) => b.memo_id - a.memo_id
        );
        setMemo(sortedMemos);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching memo details:", error);
      // Optionally, you can update the UI with an error message
    }
  };

  const handleDownloadMemoPDF = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:7071/api/memo-generate-pdf/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          responseType: "blob", // Important: Set response type to blob
        }
      );

      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Open the PDF in a new window/tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error fetching memo details:", error);
    }
  };

  useEffect(() => {
    fetchMemo();
  }, []); // Optionally add dependencies if needed

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="">
        <div className="">
          <div className="">
            <div className="text-center mb-2 p-3">
              <p className="fs-5 fw-bolder">
                {" "}
                MEMO Details {" "}
              </p>
            </div>
            <div className="">
              <div className="p-3">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="">
                      <table className="table table-striped col-12">
                        <thead>
                          <tr>
                            <th className="">DOCUMENT NO.</th>
                            <th className="">SUBJECT</th>
                            <th>BY</th>
                            <th>TYPE</th>
                            <th>DOC LINK</th>
                            <th>DATE</th>
                            <th>detsils</th>
                            <th>report</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memo.map((memoItem, index) => (
                            <tr key={memoItem.memo_id}>
                              <td>
                                {memoItem.com_initials}-{memoItem.dep_initials}-
                                {memoItem.memo_no_year}-
                                {String(memoItem.memo_no).padStart(3, "0")}
                              </td>
                              <td>{memoItem.memo_subject}</td>
                              <td>{memoItem.memo_name_employees}</td>
                              <td>{memoItem.document_type}</td>
                              <td>
                                {memoItem.memo_file ? (
                                  <a
                                    href={memoItem.memo_file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View Document
                                  </a>
                                ) : (
                                  "No Document"
                                )}
                              </td>
                              <td>
                                {new Date(
                                  memoItem.memo_datecreate
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                <a type="button" href="" className="btn col-12">
                                  <i class="bi bi-eye-fill"></i>
                                </a>
                              </td>
                              <td>
                                <a
                                  onClick={() =>
                                    handleDownloadMemoPDF(memoItem.memo_id)
                                  } // Pass a function reference
                                  href="#"
                                  className="btn col-12"
                                >
                                  <i className="bi bi-file-earmark-pdf-fill"></i>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoDetails;
