import React, { useState } from "react";
import { Form, Input, DatePicker, Select, Button, Row, Col } from "antd";
import axios from "axios";

const { Option } = Select;

const DemographicForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [levels, setLevels] = useState([]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  const handleCountryChange = async (value) => {
    try {
      // Fetch levels based on selected country
      const response = await axios.post(
        "https://developer.agristack.gov.in/n8n/webhook/get-country",
        { country_name: value }
      );
      setLevels(response.data);
      // Reset location fields when country changes
      form.resetFields(["locationLevels"]);
    } catch (error) {
      console.error("Error fetching location levels:", error);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <h2>Demographic Details</h2>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="fr_full_name"
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="fr_local_language_name" label="Local Language Name">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="fr_dob"
            label="Date of Birth"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="fr_gender"
            label="Gender"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="fr_social_category" label="Social Category">
        <Input />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="fr_email" label="Email">
            <Input type="email" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="fr_mobile_number"
            label="Mobile Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="fr_id_proof_type" label="ID Proof Type">
        <Input />
      </Form.Item>

      <Form.Item name="fr_id_proof_number" label="ID Proof Number">
        <Input />
      </Form.Item>

      <Form.Item
        name="fr_address_line_1"
        label="Address Line 1"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="fr_address_line_2" label="Address Line 2">
        <Input />
      </Form.Item>

      <Form.Item
        name="fr_local_language_address"
        label="Local Language Address"
      >
        <Input />
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="fr_postal_code" label="Postal Code">
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="fr_country"
            label="Country"
            initialValue="India"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a country"
              onChange={handleCountryChange}
            >
              <Option value="Nigeria">Nigeria</Option>
              <Option value="Rwanda">Rwanda</Option>
              <Option value="India">India</Option>
              <Option value="Ethiopia">Ethiopia</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Render dynamic levels */}
      {levels
        .sort((a, b) => a.level_order - b.level_order)
        .map((level) => (
          <Row gutter={16} key={level.location_id}>
            <Col span={8}>
              <Form.Item
                name={["locationLevels", `level_${level.level_order}`]}
                label={level.level_name}
                rules={[{ required: true }]}
              >
                <Select placeholder={`Select a ${level.level_name}`}>
                  {/* Replace the following with dynamic options fetched per level */}
                  <Option value={`${level.level_name}_Option1`}>
                    {`${level.level_name} Option1`}
                  </Option>
                  <Option value={`${level.level_name}_Option2`}>
                    {`${level.level_name} Option2`}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        ))}

      <Button className="next-button" type="primary" htmlType="submit">
        Next
      </Button>
    </Form>
  );
};

export default DemographicForm;
