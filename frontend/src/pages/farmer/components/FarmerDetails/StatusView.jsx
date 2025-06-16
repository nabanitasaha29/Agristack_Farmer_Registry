// src/components/StatusView.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Table, Typography } from "antd";

const { Title } = Typography;

const StatusView = () => {
  const location = useLocation();
  const farmerData = location.state?.farmerData;

  console.log("FarmerData received in StatusView:", farmerData);

  if (!farmerData || farmerData.length === 0) {
    return <p>No farmer data available.</p>;
  }

  const columns = [
    { title: "Farmer ID", dataIndex: "fr_farmer_id", key: "fr_farmer_id" },
    { title: "Full Name", dataIndex: "fr_full_name", key: "fr_full_name" },
    { title: "Gender", dataIndex: "fr_gender", key: "fr_gender" },
    { title: "DOB", dataIndex: "fr_dob", key: "fr_dob" },
    { title: "Mobile", dataIndex: "fr_mobile_number", key: "fr_mobile_number" },
    { title: "Email", dataIndex: "fr_email", key: "fr_email" },
    {
      title: "Social Category",
      dataIndex: "fr_social_category",
      key: "fr_social_category",
    },
    {
      title: "Farmer Type",
      dataIndex: "fr_farmer_type",
      key: "fr_farmer_type",
    },
    {
      title: "Farmer Category",
      dataIndex: "fr_farmer_category",
      key: "fr_farmer_category",
    },
    {
      title: "Land Area",
      dataIndex: "fr_total_land_area_owned",
      key: "fr_total_land_area_owned",
    },
    { title: "Village", dataIndex: "fr_level_5_id", key: "fr_level_5_id" },
    { title: "Sector", dataIndex: "fr_level_3_id", key: "fr_level_3_id" },
    { title: "Province", dataIndex: "fr_level_1_id", key: "fr_level_1_id" },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Farmer Details</Title>
      <Table
        columns={columns}
        dataSource={Array.isArray(farmerData) ? farmerData : [farmerData]}
        rowKey="fr_farmer_id"
        bordered
        pagination={false}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default StatusView;
