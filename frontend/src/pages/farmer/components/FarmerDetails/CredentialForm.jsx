// src/components/forms/CredentialsForm.jsx

import React from "react";
import { Form, Input } from "antd";

const CredentialsForm = ({ form }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      name="credentialsForm"
      requiredMark={false}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter your name" }]}
      >
        <Input placeholder="Enter your name" />
      </Form.Item>

      <Form.Item
        label="Farmer ID"
        name="farmerId"
        rules={[{ required: true, message: "Please enter Farmer ID" }]}
      >
        <Input placeholder="Enter Farmer ID" />
      </Form.Item>

      <Form.Item
        label="Registration ID"
        name="registrationId"
        rules={[{ required: true, message: "Please enter Registration ID" }]}
      >
        <Input placeholder="Enter Registration ID" />
      </Form.Item>
    </Form>
  );
};

export default CredentialsForm;
