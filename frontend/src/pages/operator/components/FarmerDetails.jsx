import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FarmerDetails.css";

const FarmerDetails = () => {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationLevels, setLocationLevels] = useState([]);//new
  const [landIdentifiers, setLandIdentifiers] = useState([]);

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        const response = await axios.post(
          "https://developer.agristack.gov.in/n8n/webhook/fetch-registrationData-byOperator",
          { farmer_id: farmerId }
        );

        // Separate farmer details and lands from the response
        const farmerData = response.data.find((item) => item.fr_farmer_id);
        const landData = response.data.filter((item) => item.fr_land_id);

        setFarmer(farmerData);
        setLands(landData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFarmerDetails();
  }, [farmerId]);

  // Fetch location hierarchy for the country of registration
  useEffect(() => {
    if (!farmer?.fr_country) return;

    const fetchConfigs = async () => {
      try {
        const [hierarchyRes, identifiersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/location/hierarchy', {
            params: { country: farmer.fr_country },
          }),
          axios.get('http://localhost:5000/api/location/land-identifiers', {
            params: { country: farmer.fr_country }, // Optional if backend supports it
          }),
        ]);

        const sortedLevels = hierarchyRes.data.hierarchy.sort(
          (a, b) => a.level_order - b.level_order
        );
        setLocationLevels(sortedLevels);
        setLandIdentifiers(identifiersRes.data?.landIdentifiers || []);
      } catch (err) {
        console.error('Failed to fetch location or identifiers:', err);
      }
    };

    fetchConfigs();
  }, [farmer?.fr_country]);
  //new
  const handleBackClick = () => {
    navigate("/operator/registered-farmers");
  };

  // Function to get location columns for land table
  const getLocationColumns = (land) => {
    return locationLevels.map((level) => {
      const key = `fr_level_${level.level_order}_id`;
      return <td key={key}>{land[key] || '-'}</td>;
    });
  };

  const getLocationHeaders = () => {
    return locationLevels.map((level) => (
      <th key={`level-${level.level_order}`}>{level.level_name}</th>
    ));
  };

  const getLocationDetailItems = () => {
    return locationLevels.map((level) => {
      const key = `fr_level_${level.level_order}_id`;
      return (
        <DetailItem
          key={key}
          label={level.level_name}
          value={farmer?.[key] || '-'}
        />
      );
    });
  };
  const getIdentifierHeaders = () => {
    return landIdentifiers.map((id, index) => (
      <th key={`identifier-${index}`}>{id.name}</th>
    ));
  };
  const getIdentifierColumns = (land) => {
    return landIdentifiers.map((_, index) => {
      const key = `fr_land_identifier_${index + 1}`;
      return <td key={key}>{land[key] || '-'}</td>;
    });
  };
  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading farmer details...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <p>Error loading farmer details: {error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );

  return (
    <div className="farmer-details-container">
      <div className="header-section">
        <button onClick={handleBackClick} className="back-button">
          &larr; Back to Farmers List
        </button>
        <h2>Farmer Details</h2>
      </div>

      <div className="details-card">
        {/* Section 1: Demographic Details */}
        <div className="section">
          <h3>Demographic Details</h3>
          <div className="detail-grid">
            <DetailItem label="Farmer ID" value={farmer.fr_farmer_id} />
            <DetailItem label="Full Name" value={farmer.fr_full_name} />
            <DetailItem
              label="Local Name"
              value={farmer.fr_local_language_name || "-"}
            />
            <DetailItem
              label="Date of Birth"
              value={new Date(farmer.fr_dob).toLocaleDateString()}
            />
            <DetailItem label="Gender" value={farmer.fr_gender} />
            <DetailItem
              label="Social Category"
              value={farmer.fr_social_category}
            />
            <DetailItem label="Mobile Number" value={farmer.fr_mobile_number} />
            <DetailItem label="Email" value={farmer.fr_email || "-"} />
            <DetailItem label="ID Proof Type" value={farmer.fr_id_proof_type} />
            <DetailItem
              label="ID Proof Number"
              value={farmer.fr_id_proof_number}
            />
            <DetailItem
              label="Address Line 1"
              value={farmer.fr_address_line_1}
            />
            <DetailItem
              label="Address Line 2"
              value={farmer.fr_address_line_2 || "-"}
            />
            <DetailItem
              label="Local Language Address"
              value={farmer.fr_local_language_address || "-"}
            />
            <DetailItem label="Postal Code" value={farmer.fr_postal_code} />
            <DetailItem label="Country" value={farmer.fr_country} />
            {getLocationDetailItems()}
          </div>
        </div>

        {/* Section 2: Land Details */}
        <div className="section">
          <h3>Land Details ({lands.length} lands)</h3>
          <div className="land-table-container">
            <table className="land-table">
              <thead>
                <tr>
                  <th>Land ID</th>
                  {getIdentifierHeaders()}
                  {/* <th>Identifier 2</th>
                  <th>Identifier 3</th> */}
                  <th>Area</th>
                  <th>Unit</th>
                  {getLocationHeaders()}
                </tr>
              </thead>
              <tbody>
                {lands.map((land) => (
                  <tr key={land.fr_land_id}>
                    <td>{land.fr_land_id}</td>
                    {getIdentifierColumns(land)}
                    {/* <td>{land.fr_land_identifier_2 || "-"}</td>
                    <td>{land.fr_land_identifier_3 || "-"}</td> */}
                    <td>{land.fr_land_area}</td>
                    <td>{land.fr_area_unit}</td>
                    {getLocationColumns(land)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Agricultural Details */}
        <div className="section">
          <h3>Agricultural Details</h3>
          <div className="detail-grid">
            <DetailItem label="Farmer Type" value={farmer.fr_farmer_type} />
            <DetailItem
              label="Farmer Category"
              value={farmer.fr_farmer_category}
            />
            <DetailItem
              label="Total Land Area"
              value={`${farmer.fr_total_land_area_owned} ${lands[0]?.fr_area_unit || "units"
                }`}
            />
            <DetailItem
              label="Number of Lands Owned"
              value={farmer.fr_no_of_lands_owned}
            />
          </div>
        </div>

        {/* Section 4: Registration Details */}
        <div className="section">
          <h3>Registration Details</h3>
          <div className="detail-grid">
            <DetailItem label="Created By" value={farmer.created_by} />
            <DetailItem
              label="Created At"
              value={new Date(farmer.created_at).toLocaleString()}
            />
            <DetailItem label="Modified By" value={farmer.modified_by || "-"} />
            <DetailItem
              label="Modified At"
              value={
                farmer.modified_at
                  ? new Date(farmer.modified_at).toLocaleString()
                  : "-"
              }
            />
            <DetailItem
              label="Registration Status"
              value={farmer.reg_status || "-"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value}</span>
  </div>
);

export default FarmerDetails;
