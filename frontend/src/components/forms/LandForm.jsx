//testing
import React, { forwardRef, useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Table,
  Card,
  Typography,
  message,
  Skeleton,
} from "antd";
import LocationSelector from "../LocationSelector";
import axios from "axios";

const { Title } = Typography;

const LandForm = forwardRef(({ onSubmit, initialValues = {} }, ref) => {
  const [form] = Form.useForm();
  const [landLocation, setLandLocation] = useState(
    initialValues.landLocation || {}
  );
  const [areaUnit, setAreaUnit] = useState("");
  const [landIdentifiers, setLandIdentifiers] = useState([]);
  const [locationHierarchy, setLocationHierarchy] = useState([]);
  const [lands, setLands] = useState(initialValues.lands || []);
  const [loading, setLoading] = useState(true);

  React.useImperativeHandle(ref, () => ({
    submit: () => {
      console.log("Form submit triggered externally");
      form.submit();
    },
    validateFields: () => {
      console.log("Validating fields externally");
      return form.validateFields();
    },
    getFieldsValue: () => {
      const values = {
        ...form.getFieldsValue(),
        lands,
      };
      console.log("Getting fields value from ref:", values);
      return values;
    },
    reset: () => {
      console.log("Resetting form and lands");
      form.resetFields();
      setLands([]);
      setLandLocation({});
    },
  }));

  useEffect(() => {
    console.log("Initial values loaded into form:", initialValues);
    form.setFieldsValue(initialValues);
    if (initialValues.lands) {
      setLands(initialValues.lands);
    }
  }, [initialValues, form]);

  useEffect(() => {
    const fetchCountryConfig = async () => {
      try {
        setLoading(true);
        const [hierarchyRes, identifiersRes, areaUnitRes] = await Promise.all([
          axios.get("http://localhost:5000/api/location/hierarchy"),
          axios.get("http://localhost:5000/api/location/land-identifiers"),
          axios.get("http://localhost:5000/api/location/area-unit"),
        ]);

        console.log("Hierarchy response:", hierarchyRes.data);
        console.log("Land Identifiers:", identifiersRes.data);
        console.log("Area Unit:", areaUnitRes.data);

        setLocationHierarchy(
          (hierarchyRes.data?.hierarchy || []).map((level) => ({
            levelOrder: level.level_order,
            levelName: level.level_name,
          }))
        );

        setLandIdentifiers(
          identifiersRes.data?.landIdentifiers?.map((id, index) => ({
            ...id,
            key: id.key || `id_${index}`,
          })) || []
        );

        setAreaUnit(areaUnitRes.data?.areaUnit || "hectares");
      } catch (error) {
        console.error("Failed to fetch country config:", error);
        message.warning("Using default configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchCountryConfig();
  }, []);

  const handleAddLand = (values) => {
    console.group("handleAddLand");
    console.log("Form values:", values);
    console.log("Selected Location:", landLocation);

    if (!landLocation || Object.keys(landLocation).length === 0) {
      message.error("Please select a location");
      console.warn("No location selected, aborting");
      return;
    }

    const locationData = {};
    locationHierarchy.forEach((level) => {
      const val = landLocation[`level_${level.levelOrder}`];
      if (val) locationData[`level_${level.levelOrder}_name`] = val;
    });

    const newLand = {
      ...values,
      landLocation: locationData,
      id: Date.now(),
      fr_area_unit: areaUnit,
    };

    console.log("New land object:", newLand);

    setLands([...lands, newLand]);
    form.resetFields();
    setLandLocation({});
    message.success("Land added successfully");
    console.groupEnd();
  };

  const handleSubmit = () => {
    console.log("Submitting lands:", lands);
    if (lands.length === 0) {
      message.warning("Please add at least one land entry");
      return;
    }
    onSubmit({ lands });
  };

  const handleDeleteLand = (id) => {
    console.log("Deleting land with ID:", id);
    setLands(lands.filter((land) => land.id !== id));
    message.success("Land removed successfully");
  };

  const generateTableColumns = () => {
    const locationColumns = locationHierarchy
      .sort((a, b) => a.levelOrder - b.levelOrder)
      .map((level) => ({
        title: level.levelName,
        key: `level_${level.levelOrder}`,
        render: (_, record) =>
          record.landLocation?.[`level_${level.levelOrder}_name`] || "-",
      }));

    const identifierColumns = landIdentifiers.map((identifier, index) => ({
      title: identifier.name,
      dataIndex: `fr_land_identifier_${index + 1}`,
      key: identifier.key,
      render: (text) => text || "-",
    }));

    return [
      ...locationColumns,
      ...identifierColumns,
      {
        title: `Area (${areaUnit})`,
        key: "area",
        render: (_, record) => `${record.fr_land_area} ${areaUnit}`,
      },
      {
        title: "Geometry",
        dataIndex: "fr_land_geometry",
        key: "geometry",
        render: (text) => text || "-",
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Button
            type="link"
            danger
            onClick={() => handleDeleteLand(record.id)}
          >
            Delete
          </Button>
        ),
      },
    ];
  };

  if (loading) {
    return (
      <Card title={<Title level={4}>Land Details</Title>}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  return (
    <Card title={<Title level={4}>Land Details</Title>}>
      <Form form={form} layout="vertical" onFinish={handleAddLand}>
        <LocationSelector
          form={form}
          fieldNamePrefix="landLocationLevels"
          hierarchy={locationHierarchy}
          onSelectionChange={(selected) => {
            console.log("LocationSelector changed:", selected);
            const newLocation = {};
            locationHierarchy.forEach((level) => {
              const matchKey = Object.keys(selected).find(
                (key) =>
                  key.toLowerCase() === level.levelName.toLowerCase() ||
                  key === `level_${level.levelOrder}`
              );
              if (matchKey && selected[matchKey]) {
                newLocation[`level_${level.levelOrder}`] = selected[matchKey];
              }
            });
            setLandLocation(newLocation);
          }}
        />

        <Row gutter={16}>
          {landIdentifiers.map((identifier, index) => (
            <Col span={8} key={index}>
              <Form.Item
                name={`fr_land_identifier_${index + 1}`}
                label={identifier.name}
                rules={[
                  {
                    required: identifier.required,
                    message: `Please enter ${identifier.name}`,
                  },
                ]}
              >
                <Input placeholder={`Enter ${identifier.name}`} />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fr_land_area"
              label="Land Area"
              rules={[{ required: true, message: "Please enter land area" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                addonAfter={areaUnit}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="fr_land_geometry" label="Land Geometry">
              <Input placeholder="GeoJSON or coordinates" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Land
          </Button>
        </Form.Item>
      </Form>

      {lands.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Table
            columns={generateTableColumns()}
            dataSource={lands}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content" }}
            bordered
          />
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ marginTop: 16, float: "right" }}
          >
            Save and Continue
          </Button>
        </div>
      )}
    </Card>
  );
});

export default LandForm;
