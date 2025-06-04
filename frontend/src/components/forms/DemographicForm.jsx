import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Button, Row, Col } from "antd";
import dayjs from "dayjs";
import { isValidPhoneNumber } from "libphonenumber-js";
import LocationSelector from "../LocationSelector";

const { Option } = Select;

const DemographicForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [countryCode, setCountryCode] = useState(null);
  const [mobileCode, setMobileCode] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(initialValues.selectedLocation || {});

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  useEffect(() => {
    const fetchCountryAndMobileCode = async () => {
      try {
        const countryRes = await fetch(
          "http://localhost:5000/api/location/active-country"
        );
        const countryData = await countryRes.json();
        const code = countryData.countryCode || "IN";
        setCountryCode(code);

        const mobileRes = await fetch(
          "http://localhost:5000/api/location/mobile-code"
        );
        const mobileData = await mobileRes.json();
        if (mobileData.mobileCode) {
          setMobileCode(mobileData.mobileCode);
        }
      } catch (error) {
        console.error("Error fetching country or mobile code:", error);
        setCountryCode("IN");
      }
    };

    fetchCountryAndMobileCode();
  }, []);

  const handleFinish = (values) => {
    const fullNumber = `+${mobileCode}${values.fr_mobile_number}`;

    onSubmit({
      ...values,
      fr_mobile_number: fullNumber,
      selectedLocation: selectedLocation,
    });
  };


  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={initialValues}>
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
                  const trimmedValue = value?.toString().trim();
                  if (!trimmedValue) {
                    return Promise.reject("Please enter mobile number");
                  }
                  if (!mobileCode || !countryCode) {
                    return Promise.reject("Codes not loaded yet");
                  }
                  //Add + before mobileCode to make full international number
                  const fullNumber = `+${mobileCode}${trimmedValue}`;
                
                  // validate using full international format
                  if (isValidPhoneNumber(fullNumber)) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    `Please enter a valid phone number for country code ${countryCode}`
                  );
                },
              },
            ]}
          >
            <Input
              addonBefore={"+" + mobileCode || "+__"}
              placeholder="Enter mobile number (without country code)"
            />
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

      {/* Calling reusable Location Selector for Dropdowns */}
      <LocationSelector
        form={form}
        fieldNamePrefix="demographicInfo"
        onSelectionChange={setSelectedLocation}
      />

      <Button className="next-button" type="primary" htmlType="submit">
        Next
      </Button>
    </Form>
  );
};

export default DemographicForm;
