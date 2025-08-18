import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from '../config/apiConfig'

const NewsShow = ({ showDeleteButton = true, showDetailsButton = false }) => {
  const [newsList, setNewsList] = useState([]);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 6; // Number of items per page

  useEffect(() => {
    // Get the JWT token from localStorage or sessionStorage
    const token = localStorage.getItem("token");

    // Set up the request headers with Authorization token
    axios
      .get(`${API_BASE_URL}/api/newsShow`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.status === "ok") {
          setNewsList(response.data.data); // Store news data in state
        } else {
          setError("Error fetching news");
        }
      })
      .catch((error) => {
        setError("Failed to fetch news");
        console.error("There was an error!", error);
      });
  }, []); // Runs when component mounts

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options); // Adjust locale as needed
  };

  //Delete
  const handleDelete = async (newsId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/newsdelete/${newsId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.status === 200) {
        alert("ข่าวถูกลบเรียบร้อยแล้ว");
        // อัพเดท UI ตามความเหมาะสม
      } else {
        alert("เกิดข้อผิดพลาดในการลบข่าว");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการลบข่าว");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsList.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Create page numbers array
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(newsList.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="container my-4">
        {error && <p className="text-denger">{error}</p>}
        <div className="">
          <div className="row ">
            {currentItems.map((news) => (
              // <div className="col-sm-6 col-md-4 mb-4">
              //   <div className="card shadow-lg h-100">
              // <div key={news.news_id} className="">
              <div className="col-sm-6 col-md-6 col-lg-4 mb-4">
                <div className="card shadow-lg h-100">
                  {news.news_image && (
                    <img
                      src={news.news_image}
                      alt={news.news_titile}
                      className="card-img-top"
                      style={{
                        height: "200px",
                        objectFit: "cover", //ย่อขยายไม่เพี้ยน
                      }}
                    />
                  )}
                  <div className="card-body">
                    <h1 className="card-title">
                      {news.news_titile.length > 48
                        ? `${news.news_titile.slice(0, 48)}...`
                        : news.news_titile}
                    </h1>
                    <p>
                      {news.news_content.length > 100
                        ? `${news.news_content.slice(0, 100)}...`
                        : news.news_content}
                    </p>
                    <p>{formatDate(news.news_date)}</p> {/* Format date here */}
                  </div>

                  <div className="">
                    <div className="">
                      <div className="">
                        {showDetailsButton && (
                          <button
                            type="button btn btn-active "
                            className=" btn btn-primary col-12"
                          >
                            อ่านเพิ่มเติม
                          </button>
                        )}
                      </div>
                      {showDeleteButton && (
                        <div className="row mb-2 p-1">
                          <div className="col col-6">
                            <button
                              type="button"
                              className="btn btn-active btn-primary col-12"
                              // onClick={() => handleDelete(news.news_id)}
                            >
                              อ่านเพิ่มเติม
                            </button>
                          </div>

                          <div className="col clo-6">
                            <button
                              type="button"
                              className="btn btn-error col-12"
                              onClick={() => handleDelete(news.news_id)}
                            >
                              ลบข้อมูล
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              // </div>
              //   </div>
              // </div>
            ))}
          </div>

          <div className="container">
            <div className="col-12">
              <div className="">
                {/* Pagination Controls */}
                <nav>
                  <ul className="pagination justify-content-center mt-4">
                    {pageNumbers.map((number) => (
                      <li
                        key={number}
                        className={`page-item ${
                          currentPage === number ? "active" : ""
                        }`}
                      >
                        <button
                          onClick={() => paginate(number)}
                          className="page-link"
                        >
                          {number}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsShow;
