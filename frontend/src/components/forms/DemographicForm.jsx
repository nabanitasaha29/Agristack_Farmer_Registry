import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Button, Row, Col } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { isValidPhoneNumber } from "libphonenumber-js";

const { Option } = Select;

const DemographicForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [levels, setLevels] = useState([]);
  const [countryCode, setCountryCode] = useState(null);

  // Fetch the hierarchy levels AND countryCode from your API on mount
  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/location/hierarchy"
        );
        // Assuming response like:
        // { countryCode: "NG", hierarchy: [...] }
        if (response.data) {
          const { countryCode, hierarchy } = response.data;
          setCountryCode(countryCode);

          if (hierarchy) {
            const sortedLevels = hierarchy.sort(
              (a, b) => a.level_order - b.level_order
            );
            setLevels(sortedLevels);
          }
        }
      } catch (error) {
        console.error("Error fetching location hierarchy:", error);
      }
    };

    fetchHierarchy();
  }, []);

  const handleFinish = (values) => {
    onSubmit(values);
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
            rules={[
              { required: true },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(
                      new Error("Please select your date of birth")
                    );
                  }
                  const today = dayjs();
                  const age = today.diff(value, "year");
                  if (age >= 18) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("You must be at least 18 years old")
                  );
                },
              },
            ]}
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
          {/* Mobile Number with validation based on fetched countryCode */}
          <Form.Item
            name="fr_mobile_number"
            label={`Mobile Number (${countryCode || "country not loaded"})`}
            rules={[
              { required: true },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(
                      new Error("Please enter mobile number")
                    );
                  }
                  if (!countryCode) {
                    return Promise.reject(
                      new Error("Country code not loaded yet")
                    );
                  }
                  if (isValidPhoneNumber(value, countryCode)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      `Please enter a valid phone number for country code ${countryCode}`
                    )
                  );
                },
              },
            ]}
          >
            <Input placeholder="Enter mobile number" />
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
      </Row>

      {/* Render inputs dynamically for location hierarchy */}
      {levels.map(({ level_order, level_name }) => (
        <Row gutter={16} key={level_order}>
          <Col span={8}>
            <Form.Item
              name={["locationLevels", `level_${level_order}`]}
              label={level_name}
              rules={[{ required: true }]}
            >
              <Select placeholder={`Select a ${level_name}`}>
                {/* Replace these options with actual API data as needed */}
                <Option value={`${level_name}_Option1`}>
                  {`${level_name} Option 1`}
                </Option>
                <Option value={`${level_name}_Option2`}>
                  {`${level_name} Option 2`}
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
