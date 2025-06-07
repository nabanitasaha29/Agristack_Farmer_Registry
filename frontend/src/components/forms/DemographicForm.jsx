import React, { forwardRef, useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Button, Row, Col } from "antd";
import dayjs from "dayjs";
import { isValidPhoneNumber } from "libphonenumber-js";
import LocationSelector from "../LocationSelector";

const { Option } = Select;

const DemographicForm = forwardRef(({ onSubmit, initialValues }, ref) => {
  const [form] = Form.useForm();
  const [countryCode, setCountryCode] = useState(null);
  const [mobileCode, setMobileCode] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(
    initialValues.selectedLocation || {}
  );
  const [idProofTypes, setIdProofTypes] = useState([]);
  const [socialCategories, setSocialCategories] = useState([]);

  // Properly expose form methods via ref
  React.useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
    validateFields: () => {
      return form.validateFields();
    },
    getFieldsValue: () => {
      return form.getFieldsValue();
    },
  }));

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

        // Fetch ID proof types based on country
        const idProofRes = await fetch(
          "http://localhost:5000/api/location/id-proof-types"
        );
        const idProofData = await idProofRes.json();
        if (idProofData.idProofTypes) {
          setIdProofTypes(idProofData.idProofTypes);
        }
      } catch (error) {
        console.error("Error fetching country or mobile code:", error);
        setCountryCode("IN");
      }
      // Fetch Social Categories
      const socialCategoryRes = await fetch(
        "http://localhost:5000/api/location/social-categories"
      );
      const socialCategoryData = await socialCategoryRes.json();
      if (socialCategoryData.socialCategories) {
        setSocialCategories(socialCategoryData.socialCategories);
      }
    };

    fetchCountryAndMobileCode();
  }, []);

  const handleFinish = (values) => {
    const fullNumber = `+${mobileCode}${values.fr_mobile_number}`;
    console.log(fullNumber);
    console.log(selectedLocation);
    console.log(values);
    onSubmit({
      ...values,
      fr_mobile_number: fullNumber,
      selectedLocation: selectedLocation,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      <h2>Demographic Details</h2>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="fr_full_name"
            label="Full Name"
            rules={[
              {
                required: true,
                message: "Please input your Full Name!",
              },
            ]}
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
              
              // {
              //   required: true,
              //   message: 'Please select your date of birth'
              // },
              {
                validator: (_, value) => {
                  
                  if (!value) {
                    return Promise.reject("Please select your Date of Birth");
                  }
                  const today = dayjs();
                  const age = today.diff(value, "year");
                  if (age >= 18) {
                    return Promise.resolve();
                  }
                  return Promise.reject("You must be at least 18 years old");
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
            rules={[
              {
                required: true,
                message: "Please select your Gender",
              },
            ]}
          >
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="fr_social_category"
        label="Social Category"
        rules={[
          { required: true, message: "Please select your Social Category" },
        ]}
      >
        <Select placeholder="Select social category">
          {socialCategories.map((cat) => (
            <Option key={cat.value} value={cat.value}>
              {cat.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="fr_email"
            label="Email"
            rules={[
              {
                type: "email",
                message: "Please enter a valid Email Address",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="fr_mobile_number"
            label={`Mobile Number (${countryCode || "country not loaded"})`}
            rules={[
              // {
              //   required: true,
              //   message: 'Please input your mobile number!'
              // },
              {
                validator: (_, value) => {
                  const trimmedValue = value?.toString().trim();
                  if (!trimmedValue) {
                    return Promise.reject("Please enter Mobile Number");
                  }
                  if (!mobileCode || !countryCode) {
                    return Promise.reject("Country code not loaded yet");
                  }
                  const fullNumber = `+${mobileCode}${trimmedValue}`;

                  if (isValidPhoneNumber(fullNumber)) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    `Please enter a valid Phone Number for ${countryCode}`
                  );
                },
              },
            ]}
          >
            <Input
              addonBefore={"+" + mobileCode || "+__"}
              placeholder="Enter Mobile Number (without country code)"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="fr_id_proof_type"
        label="ID Proof Type"
        rules={[
          {
            required: true,
            message: "Please select ID Proof Type",
          },
        ]}
      >
        <Select placeholder="Select ID Proof Type">
          {idProofTypes.map((proofType) => (
            <Option key={proofType.value} value={proofType.value}>
              {proofType.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="fr_id_proof_number"
        label="ID Proof Number"
        rules={[
          {
            required: true,
            message: "Please input your ID Proof Number",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="fr_address_line_1"
        label="Address Line 1"
        rules={[
          {
            required: true,
            message: "Please input your Address",
          },
        ]}
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
          <Form.Item
            name="fr_postal_code"
            label="Postal Code"
            rules={[
              {
                required: true,
                message: "Please input your Postal Code",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

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
});

export default DemographicForm;
