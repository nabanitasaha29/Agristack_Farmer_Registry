import React, { forwardRef, useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Button, Row, Col } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { isValidPhoneNumber } from "libphonenumber-js";
import LocationSelector from "../LocationSelector";

const { Option } = Select;

const DemographicForm = forwardRef(({ onSubmit, initialValues }, ref) => {
  const [form] = Form.useForm();
  const [countryCode, setCountryCode] = useState(null);
  const [postalCodeConfig, setPostalCodeConfig] = useState(null);
  const { label, required, regex, length } = postalCodeConfig || {};
  const [mobileCode, setMobileCode] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(
    initialValues?.selectedLocation || {}
  );
  const [idProofTypes, setIdProofTypes] = useState([]);
  const [socialCategories, setSocialCategories] = useState([]);
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY"); // Default fallback


  React.useImperativeHandle(ref, () => ({
    submit: () => form.submit(),
    validateFields: () => form.validateFields(),
    // getFieldsValue: () => form.getFieldsValue(),
    getFieldsValue: () => ({
      ...form.getFieldsValue(),
      fr_mobile_number: `+${mobileCode}${form.getFieldValue("fr_mobile_number")}`,
      locationLevels: selectedLocation, // <-- Ensure location is returned
    }),
  }));

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/location/postal-code-config")
      .then((res) => {
        setPostalCodeConfig(res.data.postalCodeConfig);
      });
  }, []);





  // Update your useEffect for initial values:
  useEffect(() => {
    let updatedValues = { ...initialValues };

    if (initialValues?.fr_mobile_number?.startsWith(`+${mobileCode}`)) {
      updatedValues.fr_mobile_number = initialValues.fr_mobile_number.replace(
        `+${mobileCode}`,
        ""
      );
    }

    // Ensure fr_dob is properly formatted
    if (initialValues?.fr_dob) {
      try {
        updatedValues.fr_dob = dayjs.isDayjs(initialValues.fr_dob)
          ? initialValues.fr_dob
          // : dayjs(initialValues.fr_dob, 'YYYY-MM-DD');
          : dayjs(initialValues.fr_dob, dateFormat);
      } catch (e) {
        console.warn("Invalid date format, resetting dob field");
        updatedValues.fr_dob = null;
      }
    }

    form.setFieldsValue(updatedValues);
  }, [initialValues, mobileCode, form]);



  useEffect(() => {
    const fetchCountryAndMobileCode = async () => {
      try {
        const [countryRes, mobileRes, idProofRes, socialCategoryRes,dateFormatRes] =
          await Promise.all([
            fetch("http://localhost:5000/api/location/active-country"),
            fetch("http://localhost:5000/api/location/mobile-code"),
            fetch("http://localhost:5000/api/location/id-proof-types"),
            fetch("http://localhost:5000/api/location/social-categories"),
            fetch("http://localhost:5000/api/location/date-format"), // New
          ]);

        const countryData = await countryRes.json();
        setCountryCode(countryData.countryCode || "IN");

        const mobileData = await mobileRes.json();
        if (mobileData.mobileCode) {
          setMobileCode(mobileData.mobileCode);
        }

        const idProofData = await idProofRes.json();
        if (idProofData.idProofTypes) {
          setIdProofTypes(idProofData.idProofTypes);
        }

        const socialData = await socialCategoryRes.json();
        if (socialData.socialCategories) {
          setSocialCategories(socialData.socialCategories);
        }
        const dfData = await dateFormatRes.json();
        if (dfData.dateFormat) {
          setDateFormat(dfData.dateFormat);
        }
      } catch (error) {
        console.error("Error fetching config data:", error);
        setCountryCode("IN");
      }
    };

    fetchCountryAndMobileCode();
  }, []);

  const handleFinish = (values) => {
    const fullNumber = `+${mobileCode}${values.fr_mobile_number}`;
    const formattedDob = values.fr_dob
      ? dayjs(values.fr_dob).format('YYYY-MM-DD')
      // ? dayjs(values.fr_dob).format(dateFormat)
      : null;
    onSubmit({
      ...values,
      fr_mobile_number: fullNumber,
      fr_dob: formattedDob,
      locationLevels: selectedLocation,
      // dateFormatUsed: dateFormat,
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
              { required: true, message: "Please input your Full Name!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="fr_local_language_name" label="Full Name in Local Language">
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
              {
                validator: (_, value) => {
                  if (!value) return Promise.reject("Please select Date of Birth");
                  try {
                    const date = dayjs(value);
                    if (!date.isValid()) return Promise.reject("Invalid date");
                    const age = dayjs().diff(date, "year");
                    return age >= 18
                      ? Promise.resolve()
                      : Promise.reject("You must be at least 18 years old");
                  } catch (e) {
                    return Promise.reject("Invalid date format");
                  }
                },
              },
            ]}
          >
            <DatePicker
              format={dateFormat}
              placeholder={dateFormat}
              style={{ width: "100%" }}
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="fr_gender"
            label="Gender"
            rules={[{ required: true, message: "Please select your Gender" }]}
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
              { type: "email", message: "Please enter a valid Email Address" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="fr_mobile_number"
            label={`Mobile Number (${countryCode || "--"})`}
            rules={[
              {
                validator: (_, value) => {
                  const trimmed = value?.trim();
                  if (!trimmed) return Promise.reject("Enter Mobile Number");
                  if (!mobileCode || !countryCode)
                    return Promise.reject("Country code not loaded");
                  return isValidPhoneNumber(`+${mobileCode}${trimmed}`)
                    ? Promise.resolve()
                    : Promise.reject(`Invalid number for ${countryCode}`);
                },
              },
            ]}
          >
            <Input
              addonBefore={"+" + (mobileCode || "__")}
              placeholder="Enter Mobile Number (without country code)"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="fr_id_proof_type"
        label="ID Proof Type"
        rules={[{ required: true, message: "Please select ID Proof Type" }]}
      >
        <Select placeholder="Select ID Proof Type">
          {idProofTypes.map((proof) => (
            <Option key={proof.value} value={proof.value}>
              {proof.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="fr_id_proof_number"
        label="ID Proof Number"
        rules={[{ required: true, message: "Enter ID Proof Number" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="fr_address_line_1"
        label="Address Line 1"
        rules={[{ required: true, message: "Enter Address" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="fr_address_line_2" label="Address Line 2">
        <Input />
      </Form.Item>

      <Form.Item
        name="fr_local_language_address"
        label="Address in Local Language"
      >
        <Input />
      </Form.Item>

      {postalCodeConfig && (
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={label}
              name="fr_postal_code"
              rules={[
                { required, message: `${label} is required` },
                { pattern: new RegExp(regex), message: `Enter valid ${label}` },
              ]}
            >
              <Input maxLength={length} />
            </Form.Item>
          </Col>
        </Row>
      )}

      <LocationSelector
        form={form}
        fieldNamePrefix="demographicInfo"
        onSelectionChange={setSelectedLocation}
      />

      <Button type="primary" htmlType="submit" className="next-button">
        Next
      </Button>
    </Form>
  );
});

export default DemographicForm;
