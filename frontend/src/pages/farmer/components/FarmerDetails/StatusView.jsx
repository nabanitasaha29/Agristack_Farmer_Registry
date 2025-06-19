// src/components/StatusView.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Table, Typography, Divider } from "antd";
import "./StatusView.css"; // import CSS for styling

const { Title } = Typography;

const StatusView = () => {
  const location = useLocation();
  const farmerData = location.state?.farmerData;

  if (!farmerData || (Array.isArray(farmerData) && farmerData.length === 0)) {
    return <p>No farmer data available.</p>;
  }

  const data = Array.isArray(farmerData) ? farmerData[0] : farmerData;

  // Group fields into categories
  const demographicFields = [
    "fr_full_name",
    "fr_local_language_name",
    "fr_dob",
    "fr_gender",
    "fr_social_category",
    "fr_email",
    "fr_mobile_number",
    "fr_id_proof_type",
    "fr_id_proof_number",
    "fr_address_line_1",
    "fr_address_line_2",
    "fr_local_language_address",
    "fr_postal_code",
    "fr_country",
  ];

  const agriculturalFields = [
    "fr_farmer_type",
    "fr_farmer_category",
    "fr_total_land_area_owned",
    "fr_no_of_lands_owned",
  ];

  const landFields = [
    "fr_land_identifier_1",
    "fr_land_identifier_2",
    "fr_land_identifier_3",
    "fr_land_area",
    "fr_area_unit",
    "fr_level_1_id",
    "fr_level_2_id",
    "fr_level_3_id",
    "fr_level_4_id",
    "fr_level_5_id",
    "fr_level_6_id",
  ];

  // Utility to create table data from selected keys
  const createSectionData = (keys) =>
    keys
      .filter((key) => data[key] !== undefined)
      .map((key, index) => ({
        key: index,
        field: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: data[key] ?? "—",
      }));

  const renderSection = (title, keys) => (
    <>
      <Divider orientation="left">
        <Title level={4} className="section-title">
          {title}
        </Title>
      </Divider>
      <Table
        columns={[
          { title: "Field", dataIndex: "field", key: "field" },
          { title: "Value", dataIndex: "value", key: "value" },
        ]}
        dataSource={createSectionData(keys)}
        pagination={false}
        bordered
        className="section-table"
      />
    </>
  );

  return (
    <div className="status-view-container">
      <Title level={3} className="main-title">
        Farmer Details Overview
      </Title>
      {renderSection("Demographic Details", demographicFields)}
      {renderSection("Agricultural Details", agriculturalFields)}
      {renderSection("Land Details", landFields)}
    </div>
  );
};

export default StatusView;
