// //testing
// import React, { forwardRef, useState, useEffect } from "react";
// import {
//   Form,
//   Input,
//   InputNumber,
//   Button,
//   Row,
//   Col,
//   Table,
//   Card,
//   Typography,
//   message,
//   Skeleton,
// } from "antd";
// import LocationSelector from "../LocationSelector";
// import axios from "axios";

// const { Title } = Typography;

// const LandForm = forwardRef(({ onSubmit, initialValues = {} }, ref) => {
//   const [form] = Form.useForm();
//   const [landLocation, setLandLocation] = useState(
//     initialValues.landLocation || {}
//   );
//   const [areaUnit, setAreaUnit] = useState("");
//   const [landIdentifiers, setLandIdentifiers] = useState([]);
//   const [locationHierarchy, setLocationHierarchy] = useState([]);
//   const [lands, setLands] = useState(initialValues.lands || []);
//   const [loading, setLoading] = useState(true);

//   React.useImperativeHandle(ref, () => ({
//     submit: () => {
//       console.log("Form submit triggered externally");
//       form.submit();
//     },
//     validateFields: () => {
//       console.log("Validating fields externally");
//       return form.validateFields();
//     },
//     getFieldsValue: () => {
//       const values = {
//         ...form.getFieldsValue(),
//         lands,
//       };
//       console.log("Getting fields value from ref:", values);
//       return values;
//     },
//     reset: () => {
//       console.log("Resetting form and lands");
//       form.resetFields();
//       setLands([]);
//       setLandLocation({});
//     },
//   }));

//   useEffect(() => {
//     console.log("Initial values loaded into form:", initialValues);
//     form.setFieldsValue(initialValues);
//     if (initialValues.lands) {
//       setLands(initialValues.lands);
//     }
//   }, [initialValues, form]);

//   useEffect(() => {
//     const fetchCountryConfig = async () => {
//       try {
//         setLoading(true);
//         const [hierarchyRes, identifiersRes, areaUnitRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/location/hierarchy"),
//           axios.get("http://localhost:5000/api/location/land-identifiers"),
//           axios.get("http://localhost:5000/api/location/area-unit"),
//         ]);

//         console.log("Hierarchy response:", hierarchyRes.data);
//         console.log("Land Identifiers:", identifiersRes.data);
//         console.log("Area Unit:", areaUnitRes.data);

//         setLocationHierarchy(
//           (hierarchyRes.data?.hierarchy || []).map((level) => ({
//             levelOrder: level.level_order,
//             levelName: level.level_name,
//           }))
//         );

//         setLandIdentifiers(
//           identifiersRes.data?.landIdentifiers?.map((id, index) => ({
//             ...id,
//             key: id.key || `id_${index}`,
//           })) || []
//         );

//         setAreaUnit(areaUnitRes.data?.areaUnit || "hectares");
//       } catch (error) {
//         console.error("Failed to fetch country config:", error);
//         message.warning("Using default configuration");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCountryConfig();
//   }, []);

//   // const handleAddLand = (values) => {
//   //   console.group("handleAddLand");
//   //   console.log("Form values:", values);
//   //   console.log("Selected Location:", landLocation);

//   //   if (!landLocation || Object.keys(landLocation).length === 0) {
//   //     message.error("Please select a location");
//   //     console.warn("No location selected, aborting");
//   //     return;
//   //   }

//   //   const locationData = {};
//   //   locationHierarchy.forEach((level) => {
//   //     const val = landLocation[`level_${level.levelOrder}`];
//   //     if (val) locationData[`level_${level.levelOrder}_name`] = val;
//   //   });

//   //   const newLand = {
//   //     ...values,
//   //     landLocation: locationData,
//   //     id: Date.now(),
//   //     fr_area_unit: areaUnit,
//   //   };

//   //   console.log("New land object:", newLand);

//   //   setLands([...lands, newLand]);
//   //   form.resetFields();
//   //   setLandLocation({});
//   //   message.success("Land added successfully");
//   //   console.groupEnd();
//   // };

//   const handleAddLand = (values) => {
//   console.group("handleAddLand");
//   console.log("Form values:", values);
//   console.log("Selected Location:", landLocation);

//   if (!landLocation || Object.keys(landLocation).length === 0) {
//     message.error("Please select a location");
//     console.warn("No location selected, aborting");
//     return;
//   }

//   // Extract location names from the selected location object
//   const locationData = {};
//   locationHierarchy.forEach((level) => {
//     const val = landLocation[`level_${level.levelOrder}`];
//     if (val) {
//       // If val is an object (with name/code), use the name, otherwise use the value directly
//       locationData[`level_${level.levelOrder}_name`] = 
//         typeof val === 'object' ? val.name : val;
//     }
//   });

//   const newLand = {
//     ...values,
//     landLocation: locationData,
//     id: Date.now(),
//     fr_area_unit: areaUnit,
//   };

//   console.log("New land object:", newLand);

//   setLands([...lands, newLand]);
//   form.resetFields();
//   setLandLocation({});
//   message.success("Land added successfully");
//   console.groupEnd();
// };
  
//   const handleSubmit = () => {
//     console.log("Submitting lands:", lands);
//     if (lands.length === 0) {
//       message.warning("Please add at least one land entry");
//       return;
//     }
//     onSubmit({ lands });
//   };

//   const handleDeleteLand = (id) => {
//     console.log("Deleting land with ID:", id);
//     setLands(lands.filter((land) => land.id !== id));
//     message.success("Land removed successfully");
//   };

//   const generateTableColumns = () => {
//     const locationColumns = locationHierarchy
//       .sort((a, b) => a.levelOrder - b.levelOrder)
//       .map((level) => ({
//         title: level.levelName,
//         key: `level_${level.levelOrder}`,
//         render: (_, record) =>
//           record.landLocation?.[`level_${level.levelOrder}_name`] || "-",
//       }));

//     const identifierColumns = landIdentifiers.map((identifier, index) => ({
//       title: identifier.name,
//       dataIndex: `fr_land_identifier_${index + 1}`,
//       key: identifier.key,
//       render: (text) => text || "-",
//     }));

//     return [
//       ...locationColumns,
//       ...identifierColumns,
//       {
//         title: `Area (${areaUnit})`,
//         key: "area",
//         render: (_, record) => `${record.fr_land_area} ${areaUnit}`,
//       },
//       {
//         title: "Geometry",
//         dataIndex: "fr_land_geometry",
//         key: "geometry",
//         render: (text) => text || "-",
//       },
//       {
//         title: "Action",
//         key: "action",
//         render: (_, record) => (
//           <Button
//             type="link"
//             danger
//             onClick={() => handleDeleteLand(record.id)}
//           >
//             Delete
//           </Button>
//         ),
//       },
//     ];
//   };

//   if (loading) {
//     return (
//       <Card title={<Title level={4}>Land Details</Title>}>
//         <Skeleton active paragraph={{ rows: 6 }} />
//       </Card>
//     );
//   }

//   return (
//     <Card title={<Title level={4}>Land Details</Title>}>
//       <Form form={form} layout="vertical" onFinish={handleAddLand}>
//     <LocationSelector
//   form={form}
//   fieldNamePrefix="landLocationLevels"
//   hierarchy={locationHierarchy}
//   onSelectionChange={(selected) => {
//     console.log("LocationSelector changed:", selected);
//     const newLocation = {};
//     locationHierarchy.forEach((level) => {
//       const matchKey = Object.keys(selected).find(
//         (key) =>
//           key.toLowerCase() === level.levelName.toLowerCase() ||
//           key === `level_${level.levelOrder}`
//       );
//       if (matchKey && selected[matchKey]) {
//         // Ensure we store the complete location object (with name and code)
//         newLocation[`level_${level.levelOrder}`] = selected[matchKey];
//       }
//     });
//     setLandLocation(newLocation);
//   }}
// />

//         <Row gutter={16}>
//           {landIdentifiers.map((identifier, index) => (
//             <Col span={8} key={index}>
//               <Form.Item
//                 name={`fr_land_identifier_${index + 1}`}
//                 label={identifier.name}
//                 rules={[
//                   {
//                     required: identifier.required,
//                     message: `Please enter ${identifier.name}`,
//                   },
//                 ]}
//               >
//                 <Input placeholder={`Enter ${identifier.name}`} />
//               </Form.Item>
//             </Col>
//           ))}
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="fr_land_area"
//               label="Land Area"
//               rules={[{ required: true, message: "Please enter land area" }]}
//             >
//               <InputNumber
//                 style={{ width: "100%" }}
//                 min={0}
//                 addonAfter={areaUnit}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item name="fr_land_geometry" label="Land Geometry">
//               <Input placeholder="GeoJSON or coordinates" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             Add Land
//           </Button>
//         </Form.Item>
//       </Form>

//       {lands.length > 0 && (
//         <div style={{ marginTop: 24 }}>
//           <Table
//             columns={generateTableColumns()}
//             dataSource={lands}
//             rowKey="id"
//             pagination={false}
//             scroll={{ x: "max-content" }}
//             bordered
//           />
//           <Button
//             type="primary"
//             onClick={handleSubmit}
//             style={{ marginTop: 16, float: "right" }}
//           >
//             Save and Continue
//           </Button>
//         </div>
//       )}
//     </Card>
//   );
// });

// export default LandForm;






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
  Checkbox,
  Divider,
  Collapse,
  Tooltip,
  Tag
} from "antd";
import { DownOutlined, UpOutlined, SearchOutlined, CheckCircleOutlined } from '@ant-design/icons';

import LocationSelector from "../LocationSelector";
import axios from "axios";
import "./LandForm.css";

const { Title } = Typography;
const { Panel } = Collapse;

const LandForm = forwardRef(({ onSubmit, initialValues = {} }, ref) => {
  const [form] = Form.useForm();
  const [landLocation, setLandLocation] = useState(initialValues.landLocation || {});
  const [areaUnit, setAreaUnit] = useState("");
  const [landIdentifiers, setLandIdentifiers] = useState([]);
  const [locationHierarchy, setLocationHierarchy] = useState([]);
  const [lands, setLands] = useState(initialValues.lands || []);
  const [loading, setLoading] = useState(true);
  const [availableLands, setAvailableLands] = useState([]);
  const [selectedLands, setSelectedLands] = useState([]);
  const [fetchingLands, setFetchingLands] = useState(false);
  const [countryCode, setCountryCode] = useState("IN");
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualFormLocation, setManualFormLocation] = useState({});

  React.useImperativeHandle(ref, () => ({
    submit: () => form.submit(),
    validateFields: () => form.validateFields(),
    getFieldsValue: () => ({
      ...form.getFieldsValue(),
      lands,
    }),
    reset: () => {
      form.resetFields();
      setLands([]);
      setLandLocation({});
      setAvailableLands([]);
      setSelectedLands([]);
    },
  }));

  useEffect(() => {
    form.setFieldsValue(initialValues);
    if (initialValues.lands) {
      setLands(initialValues.lands);
    }
  }, [initialValues, form]);

  useEffect(() => {
    const fetchCountryConfig = async () => {
      try {
        setLoading(true);
        const [
          hierarchyRes, 
          identifiersRes, 
          areaUnitRes,
          countryRes
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/location/hierarchy"),
          axios.get("http://localhost:5000/api/location/land-identifiers"),
          axios.get("http://localhost:5000/api/location/area-unit"),
          axios.get("http://localhost:5000/api/location/active-country")
        ]);

        setLocationHierarchy(
          hierarchyRes.data?.hierarchy?.map((level) => ({
            levelOrder: level.level_order,
            levelName: level.level_name,
          })) || []
        );

        setLandIdentifiers(
          identifiersRes.data?.landIdentifiers?.map((id, index) => ({
            ...id,
            key: id.key || `id_${index}`,
          })) || []
        );

        setAreaUnit(areaUnitRes.data?.areaUnit || "hectares");
        setCountryCode(countryRes.data?.countryCode || "IN");
      } catch (error) {
        console.error("Failed to fetch country config:", error);
        message.warning("Using default configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchCountryConfig();
  }, []);

  useEffect(() => {
    if (Object.keys(landLocation).length > 0) {
      const lowestLevel = locationHierarchy.reduce((prev, current) => 
        (prev.levelOrder > current.levelOrder) ? prev : current
      );
      
      const levelName = lowestLevel?.levelName || '';
      const levelValue = landLocation[`level_${lowestLevel?.levelOrder}`];
      
      if (levelValue && levelName) {
        fetchLandsAtLocation(levelName, levelValue);
      }
    }
  }, [landLocation, locationHierarchy]);

  const fetchLandsAtLocation = async (levelName, levelValue) => {
    try {
      setFetchingLands(true);
      const response = await axios.post(
        "https://developer.agristack.gov.in/n8n/webhook/get-lands",
        {
          "country-code": countryCode,
          "loc-level": levelValue.name || levelValue,
          "loc-level-id": levelValue.code || levelValue
        }
      );
      
      setAvailableLands(response.data || []);
    } catch (error) {
      console.error("Failed to fetch lands:", error);
      message.error("Failed to fetch lands for selected location");
    } finally {
      setFetchingLands(false);
    }
  };

  const handleAddSelectedLands = () => {
    if (selectedLands.length === 0) {
      message.warning("Please select at least one land");
      return;
    }

    // Filter out lands that are already added
    const landsToAdd = selectedLands.filter(land => 
      !lands.some(addedLand => addedLand.id === land.fr_land_id)
    );

    if (landsToAdd.length === 0) {
      message.warning("All selected lands have already been added");
      return;
    }

    const newLands = landsToAdd.map(land => ({
      fr_land_identifier_1: land.fr_survey_number,
      fr_land_identifier_2: land.fr_sub_division_number,
      fr_land_identifier_3: land.fr_plot_number,
      fr_land_area: land.fr_land_area,
      fr_area_unit: land.fr_area_unit,
      fr_land_geometry: land.fr_land_geometry,
      landLocation: {
        level_1_name: land.fr_state,
        level_2_name: land.fr_district,
        level_3_name: land.fr_sub_district,
        level_4_name: land.fr_village,
      },
      id: land.fr_land_id,
    }));

    setLands([...lands, ...newLands]);
    setSelectedLands([]);
    message.success(`${newLands.length} land(s) added successfully`);
  };

  const isLandAdded = (landId) => {
    return lands.some(land => land.id === landId);
  };

  const handleAddLand = (values) => {
    if (!manualFormLocation || Object.keys(manualFormLocation).length === 0) {
      message.error("Please select a location for the new land");
      return;
    }

    const locationData = {};
    locationHierarchy.forEach((level) => {
      const val = manualFormLocation[`level_${level.levelOrder}`];
      if (val) {
        locationData[`level_${level.levelOrder}_name`] = 
          typeof val === 'object' ? val.name : val;
      }
    });

    const newLand = {
      ...values,
      landLocation: locationData,
      id: Date.now(),
      fr_area_unit: areaUnit,
    };

    setLands([...lands, newLand]);
    form.resetFields();
    setManualFormLocation({});
    setShowManualForm(false);
    message.success("Land added successfully");
  };

  const handleSubmit = () => {
    if (lands.length === 0) {
      message.warning("Please add at least one land entry");
      return;
    }
    onSubmit({ lands });
  };

  const handleDeleteLand = (id) => {
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

  const availableLandsColumns = [
    {
      title: 'Select',
      dataIndex: 'fr_land_id',
      render: (id) => (
        <Checkbox
          checked={selectedLands.some(land => land.fr_land_id === id)}
          onChange={(e) => {
            if (e.target.checked) {
              if (isLandAdded(id)) {
                message.warning("This land has already been added");
                return;
              }
              const landToAdd = availableLands.find(land => land.fr_land_id === id);
              setSelectedLands([...selectedLands, landToAdd]);
            } else {
              setSelectedLands(selectedLands.filter(land => land.fr_land_id !== id));
            }
          }}
          disabled={isLandAdded(id)}
        />
      ),
      fixed: 'left',
      width: 80,
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, record) => (
        isLandAdded(record.fr_land_id) ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Added
          </Tag>
        ) : null
      ),
    },
    {
      title: 'Survey Number',
      dataIndex: 'fr_survey_number',
      filterIcon: (filtered) => (
        <Tooltip title="Search survey number">
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        </Tooltip>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search survey number"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.fr_survey_number.toLowerCase().includes(value.toLowerCase()),
    },
    // ... rest of the columns remain the same
    {
      title: 'Sub Division',
      dataIndex: 'fr_sub_division_number',
      filterIcon: (filtered) => (
        <Tooltip title="Search sub division">
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        </Tooltip>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search sub division"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.fr_sub_division_number.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Plot Number',
      dataIndex: 'fr_plot_number',
      filterIcon: (filtered) => (
        <Tooltip title="Search plot number">
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        </Tooltip>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search plot number"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.fr_plot_number.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: `Area (${areaUnit})`,
      render: (record) => `${record.fr_land_area} ${record.fr_area_unit}`,
      sorter: (a, b) => a.fr_land_area - b.fr_land_area,
    },
    {
      title: 'Location',
      render: (record) => `${record.fr_village}, ${record.fr_sub_district}`,
      filterIcon: (filtered) => (
        <Tooltip title="Search location">
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        </Tooltip>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search location"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        `${record.fr_village} ${record.fr_sub_district}`.toLowerCase().includes(value.toLowerCase()),
    }
  ];

  if (loading) {
    return (
      <Card title={<Title level={4}>Land Details</Title>}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  return (
    <Card title={<Title level={4}>Land Details</Title>}>
      <div className="land-form-container">
        <div className="location-selection-section">
          <h3>Select Location to View Lands</h3>
          <LocationSelector
            form={form}
            fieldNamePrefix="landLocationLevels"
            hierarchy={locationHierarchy}
            onSelectionChange={(selected) => {
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
        </div>

        {availableLands.length > 0 && (
          <div className="available-lands-section">
            <Divider orientation="left">Available Lands at Selected Location</Divider>
            <Table
              className="available-lands-table"
              columns={availableLandsColumns}
              dataSource={availableLands}
              rowKey="fr_land_id"
              pagination={false}
              loading={fetchingLands}
              scroll={{ x: 'max-content' }}
              bordered
            />
            <Button
              type="primary"
              onClick={handleAddSelectedLands}
              style={{ marginTop: 16 }}
              disabled={selectedLands.length === 0}
            >
              Add Selected Lands
            </Button>
          </div>
        )}

        {/* Rest of the component remains the same */}
        <div className="manual-land-section">
          <Button
            type="default"
            onClick={() => setShowManualForm(!showManualForm)}
            icon={showManualForm ? <UpOutlined /> : <DownOutlined />}
            style={{ marginBottom: 16 }}
          >
            {showManualForm ? 'Hide Manual Land Form' : 'Add New Land Manually'}
          </Button>

          <Collapse activeKey={showManualForm ? ['1'] : []} ghost>
            <Panel key="1" header={null} showArrow={false}>
              <Form form={form} layout="vertical" onFinish={handleAddLand}>
                <div className="manual-form-location">
                  <h4>Select Location for New Land</h4>
                  <LocationSelector
                    form={form}
                    fieldNamePrefix="manualLandLocation"
                    hierarchy={locationHierarchy}
                    onSelectionChange={(selected) => {
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
                      setManualFormLocation(newLocation);
                    }}
                  />
                </div>

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
                    Add New Land
                  </Button>
                </Form.Item>
              </Form>
            </Panel>
          </Collapse>
        </div>

        {lands.length > 0 && (
          <div className="my-lands-section">
            <Divider orientation="left">My Lands</Divider>
            <Table
              className="my-lands-table"
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
      </div>
    </Card>
  );
});

export default LandForm;


