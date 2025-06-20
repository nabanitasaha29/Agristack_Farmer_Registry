import React, { forwardRef, useEffect,useState } from "react";
import { Form, Input, InputNumber, Select, Button } from "antd";
import axios from "axios";


const { Option } = Select;

const AgriculturalForm = forwardRef(
  ({ onSubmit, onFinalAction, initialValues}, ref) => {
    const [form] = Form.useForm();
    const [areaUnit, setAreaUnit] = useState("hectares");

useEffect(() => {
  const fetchAreaUnit = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/location/area-unit");
      setAreaUnit(res.data?.areaUnit || "hectares");
    } catch (error) {
      console.error("Failed to fetch area unit:", error);
    }
  };

  fetchAreaUnit();
}, []);

    React.useImperativeHandle(ref, () => ({
      submit: () => form.submit(),
      validateFields: () => form.validateFields(),
      getFieldsValue: () => form.getFieldsValue(),
    }));

    useEffect(() => {
      form.resetFields();
      form.setFieldsValue(initialValues);
    }, [initialValues, form]);

    return (
      <Form form={form} layout="vertical">
        <h2>Agricultural Details</h2>

        <Form.Item
          name="fr_farmer_type"
          label="Farmer Type"
          rules={[{ required: true, message: "Please select Farmer Type" }]}
        >
          <Select>
            <Option value="Landowner">Landowner</Option>
            <Option value="Tenant">Tenant</Option>
            <Option value="Sharecropper">Sharecropper</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="fr_farmer_category"
          label="Farmer Category"
          rules={[{ required: true, message: "Please select Farmer Category" }]}
        >
          <Select disabled>
            <Option value="Small">Small</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Large">Large</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="fr_total_land_area_owned"
          label={`Total Land Area Owned (${areaUnit})`}
        >
          <InputNumber
            style={{ width: "100%" }}
            readOnly
            formatter={(value) => `${value} ${areaUnit}`}
            parser={(value) => value.replace(` ${areaUnit}`, "")}
          />
        </Form.Item>

        <Form.Item name="fr_no_of_lands_owned" label="Number of Lands Owned">
          <InputNumber style={{ width: "100%" }} readOnly />
        </Form.Item>

        <div style={{ marginTop: "16px" }}>
          <Button
            type="primary"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  console.log(values);
                  onSubmit(values);
                  onFinalAction("submit");
                })
                .catch(() => message.error("Please fill all required fields"));
            }}
            style={{ marginRight: "8px" }}
          >
            Submit
          </Button>
          <Button
            onClick={() => onFinalAction("draft")}
            style={{ marginRight: "8px" }}
          >
            Save as Draft
          </Button>
          <Button onClick={() => onFinalAction("restart")} danger>
            Reset
          </Button>
        </div>
      </Form>
    );
  }
);

export default AgriculturalForm;
