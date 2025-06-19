import React, { useState, useEffect } from "react";
import { useAuth } from "../../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisteredFarmers.css";

// Date formatting utility
const formatApiDate = (apiDateString) => {
  if (!apiDateString || apiDateString === "null") return "-";

  try {
    const [day, month, year, , time, period] = apiDateString.split(" ");
    const [hours, minutes] = time.split(":");

    let hours24 = parseInt(hours);
    if (period === "pm" && hours24 < 12) hours24 += 12;
    if (period === "am" && hours24 === 12) hours24 = 0;

    const date = new Date(`${month} ${day}, ${year} ${hours24}:${minutes}`);

    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return apiDateString;
  }
};

const RegisteredFarmers = () => {
  const { username } = useAuth();
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const farmersPerPage = 10;

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axios.post(
          "https://developer.agristack.gov.in/n8n/webhook/fetch-registrationData-byOperator",
          { created_by: username }
        );
        setFarmers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFarmers();
  }, [username]);

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.fr_farmer_id.toString().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFarmer = currentPage * farmersPerPage;
  const indexOfFirstFarmer = indexOfLastFarmer - farmersPerPage;
  const currentFarmers = filteredFarmers.slice(
    indexOfFirstFarmer,
    indexOfLastFarmer
  );
  const totalPages = Math.ceil(filteredFarmers.length / farmersPerPage);

  const handleRowClick = (farmerId) => {
    navigate(`/operator/farmer-details/${farmerId}`);
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading farmers data...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <p>Error loading data: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="registered-farmers-container">
      <div className="registered-farmers-header-section">
        <h2 className="registered-farmers-page-title">Registered Farmers</h2>
        <div className="registered-farmers-controls-section">
          <div className="registered-farmers-search-box">
            <svg className="registered-farmers-search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search by Farmer ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="registered-farmers-search-input"
            />
          </div>
        </div>
      </div>

      <div className="registered-farmers-table-card">
        <div className="registered-farmers-table-responsive">
          <table className="registered-farmers-table">
            <thead>
              <tr>
                <th>Farmer ID</th>
                <th>Full Name</th>
                <th>Created At</th>
                <th>Modified By</th>
                <th>Modified At</th>
              </tr>
            </thead>
            <tbody>
              {currentFarmers.length > 0 ? (
                currentFarmers.map((farmer) => (
                  <tr
                    key={farmer.fr_farmer_id}
                    onClick={() => handleRowClick(farmer.fr_farmer_id)}
                    className="registered-farmers-clickable-row"
                  >
                    <td data-label="Farmer ID">{farmer.fr_farmer_id}</td>
                    <td data-label="Full Name">{farmer.fr_full_name}</td>
                    <td data-label="Created At">
                      {formatApiDate(farmer.created_at)}
                    </td>
                    <td data-label="Modified By">
                      {farmer.modified_by || "-"}
                    </td>
                    <td data-label="Modified At">
                      {formatApiDate(farmer.modified_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="registered-farmers-no-data-row">
                  <td colSpan="5">
                    <div className="registered-farmers-no-data-message">
                      <svg
                        className="registered-farmers-empty-icon"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                      <p>No farmers found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredFarmers.length > farmersPerPage && (
        <div className="registered-farmers-pagination-container">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="registered-farmers-pagination-button"
          >
            <svg
              className="registered-farmers-pagination-icon"
              viewBox="0 0 24 24"
            >
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
            Previous
          </button>

          <div className="registered-farmers-page-indicator">
            Page{" "}
            <span className="registered-farmers-current-page">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="registered-farmers-total-pages">{totalPages}</span>
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="registered-farmers-pagination-button"
          >
            Next
            <svg
              className="registered-farmers-pagination-icon"
              viewBox="0 0 24 24"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisteredFarmers;
