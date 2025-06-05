import React from "react";
import { Button } from "antd";

const TabsNavigation = ({ activeTab, onTabChange }) => (
  <div className="tabs">
    <Button
      className="tab-button"
      type={activeTab === 1 ? "primary" : "default"}
      onClick={() => onTabChange(1)}
    >
      Demographic Details
    </Button>
    <Button
      className="tab-button"
      type={activeTab === 2 ? "primary" : "default"}
      onClick={() => onTabChange(2)}
    >
      Land Details
    </Button>
    <Button
      className="tab-button"
      type={activeTab === 3 ? "primary" : "default"}
      onClick={() => onTabChange(3)}
    >
      Agricultural Details
    </Button>
  </div>
);

export default TabsNavigation;