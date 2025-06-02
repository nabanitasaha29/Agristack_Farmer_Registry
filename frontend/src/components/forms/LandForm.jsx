import React from "react";
import { Form, Input, InputNumber, Button, Row, Col } from "antd";

const LandForm = ({ onSubmit, onFinalAction }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <h2>Land Details</h2>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="fr_land_identifier_1"
            label="Land Identifier 1"
            rules={[{ required: true }]}
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
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="fr_area_unit"
            label="Area Unit"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="fr_land_geometry" label="Land Geometry">
        <Input placeholder="GeoJSON or coordinates" />
      </Form.Item>

      <Button className="next-button" type="primary" htmlType="submit">
        Save Details
      </Button>

      <div style={{ marginTop: "16px" }}>
        <Button
          className="next-button"
          onClick={() => onFinalAction("submit")}
          type="primary"
          style={{ marginRight: "8px" }}
        >
          Submit
        </Button>
        <Button
          className="draft-button"
          onClick={() => onFinalAction("draft")}
          style={{ marginRight: "8px" }}
        >
          Save as Draft
        </Button>
        <Button
          className="restart-button"
          onClick={() => onFinalAction("restart")}
          danger
        >
          Restart
        </Button>
      </div>
    </Form>
  );
};

export default LandForm;
