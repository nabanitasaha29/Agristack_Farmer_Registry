import React, { useEffect, useState } from "react";
import { Row, Col, Form, Select, Spin } from "antd";
import axios from "axios";

const { Option } = Select;

const LocationSelector = ({ form, fieldNamePrefix, onSelectionChange }) => {
  const [levels, setLevels] = useState([]);
  const [countryCode, setCountryCode] = useState(null);
  const [locationOptions, setLocationOptions] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [isHierarchyLoading, setIsHierarchyLoading] = useState(true); // global spinner
  const [loadingLevel, setLoadingLevel] = useState(null);

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        setIsHierarchyLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/location/hierarchy"
        );

        if (response.data) {
          const { countryCode, hierarchy } = response.data;
          setCountryCode(countryCode);

          if (hierarchy) {
            const sortedLevels = hierarchy.sort(
              (a, b) => a.level_order - b.level_order
            );
            setLevels(sortedLevels);
            if (sortedLevels.length > 0) {
              fetchOptionsForLevel(sortedLevels[0].level_name); // top-level options
            }
          }
        }
      } catch (error) {
        console.error("Error fetching location hierarchy:", error);
      } finally {
        setIsHierarchyLoading(false);
      }
    };

    fetchHierarchy();
  }, []);
  useEffect(() => {
    if (!levels.length) return;

    const restored = {};
    levels.forEach(({ level_order, level_name }) => {
      const val = form.getFieldValue([fieldNamePrefix, "locationLevels", `level_${level_order}`]);
      if (val) {
        restored[level_name] = val;
      }
    });

    setSelectedValues(restored);

    // Fetch options for levels where parent value exists
    levels.forEach(({ level_order, level_name }) => {
      const parent = levels.find((lvl) => lvl.level_order === level_order - 1);
      const parentValue = parent ? restored[parent.level_name] : null;

      if (restored[level_name]) {
        fetchOptionsForLevel(level_name, parentValue);
      }
    });

    onSelectionChange?.(restored);
  }, [form, levels]);


  const fetchOptionsForLevel = async (levelName, parentValue = null) => {
    try {
      setLoadingLevel(levelName);
      const response = await axios.get(
        "http://localhost:5000/api/location/location-options",
        {
          params: {
            levelName,
            parentValue,
          },
        }
      );

      if (response.data?.options) {
        setLocationOptions((prev) => ({
          ...prev,
          [levelName]: response.data.options,
        }));
      }
    } catch (error) {
      console.error(`Error fetching options for ${levelName}:`, error);
    } finally {
      setLoadingLevel(null); // Stop spinner
    }
  };

  const handleLevelChange = (levelName, value, levelOrder) => {
    const updatedSelectedValues = {
      ...selectedValues,

      [levelName]: value?.value || value,
    };

    // Update state once
    setSelectedValues(updatedSelectedValues);

    // Call parent callback with updated selection
    onSelectionChange?.(updatedSelectedValues);

    // Clear dependent lower levels
    setLocationOptions((prev) => {
      const updated = { ...prev };
      levels.forEach(({ level_order: lo, level_name: ln }) => {
        if (lo > levelOrder) delete updated[ln];
      });
      return updated;
    });

    // Also clear selected values for child levels in the form
    const clearedSelectedValues = { ...updatedSelectedValues };
    levels.forEach(({ level_order: lo, level_name: ln }) => {
      if (lo > levelOrder) {
        form.setFieldValue(
          [fieldNamePrefix, "locationLevels", `level_${lo}`],
          undefined
        );
        delete clearedSelectedValues[ln];
      }
    });

    // Update state again and notify parent with cleared values
    setSelectedValues(clearedSelectedValues);
    onSelectionChange?.(clearedSelectedValues);

    // Find the next level
    const nextLevel = levels.find((lvl) => lvl.level_order === levelOrder + 1);

    if (nextLevel) {
      fetchOptionsForLevel(nextLevel.level_name, value);
    }
  };
  if (isHierarchyLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Spin tip="Loading location fields..." />
      </div>
    );
  }
  return (
    <Row gutter={[16, 16]} wrap>
      {levels.map(({ level_order, level_name }, index) => {
        const parent = levels.find(
          (lvl) => lvl.level_order === level_order - 1
        );
        const isDisabled = parent && !selectedValues[parent.level_name];

        return (
          <Col key={level_order} xs={24} sm={12} md={8} lg={6} xl={6}>
            <Form.Item
              name={[fieldNamePrefix, "locationLevels", `level_${level_order}`]}
              label={level_name}
              rules={[{ required: true, message: `Please select ${level_name}` }]}

            >
              <Select
                placeholder={`Select a ${level_name}`}
                onChange={(value) =>
                  handleLevelChange(level_name, value, level_order)
                }
                value={selectedValues[level_name] || undefined}
                disabled={isDisabled}
                loading={loadingLevel === level_name}
              >
                {(locationOptions[level_name] || []).map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        );
      })}
    </Row>
  );
};
export default LocationSelector;
