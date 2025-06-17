import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FarmerDetails.css';

const FarmerDetails = () => {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        const response = await axios.post(
          'https://developer.agristack.gov.in/n8n/webhook/fetch-registrationData-byOperator',
          { farmer_id: farmerId }
        );
        setFarmer(response.data[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFarmerDetails();
  }, [farmerId]);


    const handleBackClick = () => {
    // Navigate to the registered farmers list
    navigate('/operator/registered-farmers');
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading farmer details...</p>
    </div>
  );

  if (error) return (
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
            <DetailItem label="Local Name" value={farmer.fr_local_language_name || '-'} />
            <DetailItem label="Date of Birth" value={new Date(farmer.fr_dob).toLocaleDateString()} />
            <DetailItem label="Gender" value={farmer.fr_gender} />
            <DetailItem label="Social Category" value={farmer.fr_social_category} />
            <DetailItem label="Mobile Number" value={farmer.fr_mobile_number} />
            <DetailItem label="Email" value={farmer.fr_email || '-'} />
            <DetailItem label="ID Proof Type" value={farmer.fr_id_proof_type} />
            <DetailItem label="ID Proof Number" value={farmer.fr_id_proof_number} />
            <DetailItem label="Address Line 1" value={farmer.fr_address_line_1} />
            <DetailItem label="Address Line 2" value={farmer.fr_address_line_2 || '-'} />
            <DetailItem label="Local Language Address" value={farmer.fr_local_language_address || '-'} />
            <DetailItem label="Postal Code" value={farmer.fr_postal_code} />
            <DetailItem label="Country" value={farmer.fr_country} />
            <DetailItem label="State" value={farmer.fr_level_1_id} />
            <DetailItem label="District" value={farmer.fr_level_2_id} />
            <DetailItem label="Ward/Village" value={farmer.fr_level_3_id} />
            {farmer.fr_level_4_id && <DetailItem label="Level 4" value={farmer.fr_level_4_id} />}
            {farmer.fr_level_5_id && <DetailItem label="Level 5" value={farmer.fr_level_5_id} />}
            {farmer.fr_level_6_id && <DetailItem label="Level 6" value={farmer.fr_level_6_id} />}
          </div>
        </div>

        {/* Section 2: Land Details */}
        <div className="section">
          <h3>Land Details</h3>
          <div className="detail-grid">
            {/* Empty for now as requested */}
            <DetailItem label="Total Lands" value="-" />
            
          </div>
        </div>

        {/* Section 3: Agricultural Details */}
        <div className="section">
          <h3>Agricultural Details</h3>
          <div className="detail-grid">
            <DetailItem label="Farmer Type" value={farmer.fr_farmer_type} />
            <DetailItem label="Farmer Category" value={farmer.fr_farmer_category} />
            <DetailItem label="Total Land Area (acres)" value={farmer.fr_total_land_area_owned} />
            <DetailItem label="Number of Lands Owned" value={farmer.fr_no_of_lands_owned} />
            
          </div>
        </div>

        {/* Section 4: Registration Details (kept as is) */}
        <div className="section">
          <h3>Registration Details</h3>
          <div className="detail-grid">
            <DetailItem label="Created By" value={farmer.created_by} />
            <DetailItem label="Created At" value={new Date(farmer.created_at).toLocaleString()} />
            <DetailItem label="Modified By" value={farmer.modified_by || '-'} />
            <DetailItem label="Modified At" value={farmer.modified_at ? new Date(farmer.modified_at).toLocaleString() : '-'} />
            <DetailItem label="Registration Status" value={farmer.reg_status || '-'} />
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