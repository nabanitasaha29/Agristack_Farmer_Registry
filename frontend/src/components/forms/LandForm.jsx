import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Row, Col, message } from "antd";

const LandForm = ({ onFinalAction }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  

  const handleFinish = async (values) => {
    console.log("Submitting form data:", values);
    setLoading(true);
    try {
      const response = await fetch(
        "https://developer.agristack.gov.in/n8n/webhook/farmer-ragistration-submission",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      message.success("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <h2>Land Details</h2>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="fr_land_identifier_1"
            label="Land Identifier 1"
            rules={[
              { required: true, message: "Please enter Land Identifier 1" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="fr_land_identifier_2" label="Land Identifier 2">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="fr_land_identifier_3" label="Land Identifier 3">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="fr_land_area"
            label="Land Area"
            rules={[{ required: true, message: "Please enter Land Area" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="fr_area_unit"
            label="Area Unit"
            rules={[{ required: true, message: "Please enter Area Unit" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="fr_land_geometry" label="Land Geometry">
        <Input placeholder="GeoJSON or coordinates" />
      </Form.Item>

      <Button
        className="next-button"
        type="primary"
        htmlType="submit"
        loading={loading}
      >
        Save Details
      </Button>

      <div style={{ marginTop: "16px" }}>
        <Button
          className="next-button"
          onClick={() => onFinalAction("submit")}
          type="primary"
          style={{ marginRight: "8px" }}
          disabled={loading}
        >
          Submit
        </Button>
        <Button
          className="draft-button"
          onClick={() => onFinalAction("draft")}
          style={{ marginRight: "8px" }}
          disabled={loading}
        >
          Save as Draft
        </Button>
        <Button
          className="restart-button"
          onClick={() => onFinalAction("restart")}
          danger
          disabled={loading}
        >
          Restart
        </Button>
      </div>
    </Form>
  );
};

export default LandForm;
