import React from "react";

const TabsNavigation = ({ activeTab, onTabChange }) => (
  <div className="tabs">
    <button
      className={activeTab === 1 ? "active" : ""}
      onClick={() => onTabChange(1)}
    >
      Demographic Details
    </button>
    <button
      className={activeTab === 2 ? "active" : ""}
      onClick={() => onTabChange(2)}
    >
      Land Details
    </button>
    <button
      className={activeTab === 3 ? "active" : ""}
      onClick={() => onTabChange(3)}
    >
      Agricultural Details
    </button>
  </div>
);

export default TabsNavigation;