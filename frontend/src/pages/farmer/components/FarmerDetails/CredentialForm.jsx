import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CredentialForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("🔍 Submitting values:", values);

    try {
      const response = await axios.post(
        "https://developer.agristack.gov.in/n8n/webhook/get-farmer-registration-details",
        values
      );

      console.log("✅ API response:", response);

      const data = response.data;
      console.log("✅ Data from API:", data);
      if (!data || typeof data !== "object" || data.length === 0) {
        message.warning("No valid farmer data found.");
        return;
      }

      // Navigate to next view with farmerData
      navigate("/farmer/registration-details", {
        state: { farmerData: data },
      });
    } catch (error) {
      console.error("❌ API Error:", error);
      message.error("Failed to fetch farmer data.");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "400px" }}>
      <h3>Enter Farmer Credentials</h3>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          farmer_name: "",
          farmer_registration_id: "",
        }}
      >
        <Form.Item
          label="Farmer Name"
          name="farmer_name"
          rules={[{ required: true, message: "Please enter farmer name" }]}
        >
          <Input placeholder="e.g. nabanita" />
        </Form.Item>

        <Form.Item
          label="Farmer Registration ID"
          name="farmer_registration_id"
          rules={[{ required: true, message: "Please enter registration ID" }]}
        >
          <Input placeholder="e.g. 265" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Get Details
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CredentialForm;
