import React from "react";
import { Form, Input, InputNumber, Select, Button } from "antd";

const { Option } = Select;

const AgriculturalForm = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <h2>Agricultural Details</h2>
      <Form.Item name="crop_type" label="Crop Type" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="fr_farmer_type" label="Farmer Type" rules={[{ required: true }]}>
        <Select>
          <Option value="Small">Small</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Large">Large</Option>
        </Select>
      </Form.Item>

      <Form.Item name="fr_farmer_category" label="Farmer Category" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="fr_total_land_area_owned" label="Total Land Area Owned" rules={[{ required: true }]}>
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="fr_no_of_lands_owned" label="Number of Lands Owned" rules={[{ required: true }]}>
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Button className="next-button" type="primary" htmlType="submit">
        Next
      </Button>
    </Form>
  );
};

export default AgriculturalForm;
