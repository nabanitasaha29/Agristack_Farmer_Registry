import React from "react";
import { Form, Input, InputNumber, Select, Button } from "antd";

const { Option } = Select;

const AgriculturalForm = ({ onSubmit, onFinalAction }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Form Submitted Values:", values);
    onSubmit(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <h2>Agricultural Details</h2>

      <Form.Item
        name="fr_farmer_type"
        label="Farmer Type"
        rules={[{ required: true }]}
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
        rules={[{ required: true }]}
      >
        <Select>
          <Option value="Small">Small</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Large">Large</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="fr_total_land_area_owned"
        label="Total Land Area Owned"
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="fr_no_of_lands_owned"
        label="Number of Lands Owned"
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <div style={{ marginTop: "16px" }}>
        <Button
          htmlType="submit"
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

export default AgriculturalForm;
