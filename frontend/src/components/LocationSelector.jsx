import React, { useEffect, useState } from "react";
import { Row, Col, Form, Select, Spin } from "antd";
import axios from "axios";

const { Option } = Select;

const LocationSelector = ({ form, fieldNamePrefix, onSelectionChange }) => {
  const [levels, setLevels] = useState([]);
  const [locationOptions, setLocationOptions] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [isHierarchyLoading, setIsHierarchyLoading] = useState(true);
  const [loadingLevel, setLoadingLevel] = useState(null);

  // Fetch hierarchy on mount
  useEffect(() => {
    const fetchHierarchy = async () => {
      setIsHierarchyLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/location/hierarchy"
        );
        if (response.data?.hierarchy) {
          const sortedLevels = response.data.hierarchy.sort(
            (a, b) => a.level_order - b.level_order
          );
          setLevels(sortedLevels);
          if (sortedLevels.length > 0) {
            fetchOptionsForLevel(sortedLevels[0].level_name); // fetch top level options
          }
        }
      } catch (err) {
        console.error("Error fetching location hierarchy:", err);
      } finally {
        setIsHierarchyLoading(false);
      }
    };

    fetchHierarchy();
  }, []);

  // Restore saved values from form and fetch options for dependent levels
  useEffect(() => {
    if (!levels.length) return;

    const restored = {};
    levels.forEach(({ level_order, level_name }) => {
      const val = form.getFieldValue([
        fieldNamePrefix,
        "locationLevels",
        `level_${level_order}`,
      ]);
      if (val) restored[level_name] = val;
    });

    setSelectedValues(restored);

    // Fetch options for each level where parent is selected
    levels.forEach(({ level_order, level_name }) => {
      const parent = levels.find((lvl) => lvl.level_order === level_order - 1);
      const parentValue = parent ? restored[parent.level_name] : null;
      if (restored[level_name]) {
        fetchOptionsForLevel(level_name, parentValue);
      }
    });

    onSelectionChange?.(restored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, levels]);

  // Fetch options for a specific level given optional parent value
  const fetchOptionsForLevel = async (levelName, parentValue = null) => {
    setLoadingLevel(levelName);
    try {
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
    } catch (err) {
      console.error(`Error fetching options for ${levelName}:`, err);
    } finally {
      setLoadingLevel(null);
    }
  };

  // Handle selection changes for a level
  const handleLevelChange = (levelName, value, levelOrder) => {
    const selectedVal = value?.value || value;

    // Update selectedValues state
    const updatedSelected = { ...selectedValues, [levelName]: selectedVal };

    setSelectedValues(updatedSelected);
    onSelectionChange?.(updatedSelected);

    // Clear options and form values for all child levels
    setLocationOptions((prev) => {
      const updatedOptions = { ...prev };
      levels.forEach(({ level_order: lo, level_name: ln }) => {
        if (lo > levelOrder) delete updatedOptions[ln];
      });
      return updatedOptions;
    });

    // Clear form values and selected values for child levels
    const clearedSelected = { ...updatedSelected };
    levels.forEach(({ level_order: lo, level_name: ln }) => {
      if (lo > levelOrder) {
        form.setFieldValue(
          [fieldNamePrefix, "locationLevels", `level_${lo}`],
          undefined
        );
        delete clearedSelected[ln];
      }
    });

    setSelectedValues(clearedSelected);
    onSelectionChange?.(clearedSelected);

    // Fetch options for next level if exists
    const nextLevel = levels.find((lvl) => lvl.level_order === levelOrder + 1);
    if (nextLevel) {
      fetchOptionsForLevel(nextLevel.level_name, selectedVal);
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
      {levels.map(({ level_order, level_name }) => {
        const parent = levels.find(
          (lvl) => lvl.level_order === level_order - 1
        );
        const isDisabled = parent && !selectedValues[parent.level_name];

        return (
          <Col key={level_order} xs={24} sm={12} md={8} lg={6} xl={6}>
            <Form.Item
              name={[fieldNamePrefix, "locationLevels", `level_${level_order}`]}
              label={level_name}
              rules={[
                { required: true, message: `Please select ${level_name}` },
              ]}
            >
              <Select
                placeholder={`Select a ${level_name}`}
                onChange={(val) =>
                  handleLevelChange(level_name, val, level_order)
                }
                value={selectedValues[level_name] || undefined}
                disabled={isDisabled}
                loading={loadingLevel === level_name}
                allowClear
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
