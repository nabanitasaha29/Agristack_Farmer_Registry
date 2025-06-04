import { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, Row, Col } from "antd";
import LocationSelector from "../LocationSelector";
import axios from "axios";
const LandForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [landLocation, setLandLocation] = useState({});

  const [areaUnit, setAreaUnit] = useState("");

  useEffect(() => {
    const fetchAreaUnit = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/location/area-unit"
        );
        setAreaUnit(response.data.areaUnit);
      } catch (error) {
        console.error("Failed to fetch area unit", error);
      }
    };

    fetchAreaUnit();
  }, []);

  const handleFinish = (values) => {
    onSubmit({
      ...values,
      landLocation: landLocation,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <h2>Land Details</h2>
      {/* Calling reusable Location Selector for Dropdowns */}
      <LocationSelector
        form={form}
        fieldNamePrefix="landLocationLevels"
        onSelectionChange={setLandLocation}
      />

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
            <InputNumber style={{ width: "100%" }} addonAfter={areaUnit} />
          </Form.Item>
        </Col>
        <Col span={12}></Col>
      </Row>

      <Form.Item name="fr_land_geometry" label="Land Geometry">
        <Input placeholder="GeoJSON or coordinates" />
      </Form.Item>

      <Button className="next-button" type="primary" htmlType="submit">
        Next
      </Button>
    </Form>
  );
};

export default LandForm;
