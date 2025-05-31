import React from 'react';

const TabsNavigation = ({ activeTab, setActiveTab }) => (
  <div className="tabs">
    <button className={activeTab === 1 ? 'active' : ''} disabled={activeTab < 1} onClick={() => setActiveTab(1)}>Demographic Details</button>
    <button className={activeTab === 2 ? 'active' : ''} disabled={activeTab < 2} onClick={() => setActiveTab(2)}>Agricultural Details</button>
    <button className={activeTab === 3 ? 'active' : ''} disabled={activeTab < 3} onClick={() => setActiveTab(3)}>Land Details</button>
  </div>
);

export default TabsNavigation;
