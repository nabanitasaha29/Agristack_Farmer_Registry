import React, { useState } from "react";
import "./MainFormPage.css";
import DemographicForm from "../../components/forms/DemographicForm";
import AgriculturalForm from "../../components/forms/AgriculturalForm";
import LandForm from "../../components/forms/LandForm";
import TabsNavigation from "../../components/TabsNavigation";

const MainFormPage = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    demographic: {},
    agricultural: {},
    land: {},
  });

  const handleDemographicSubmit = (data) => {
    setFormData((prev) => ({ ...prev, demographic: data }));
    setActiveTab(2);
  };
  const handleAgriculturalSubmit = (data) => {
    setFormData((prev) => ({ ...prev, agricultural: data }));
    setActiveTab(3);
  };
  const handleLandSubmit = (data) => {
    setFormData((prev) => ({ ...prev, land: data }));
  };

  const handleFinalAction = (action) => {
    if (action === "submit")
      alert("Form submitted: " + JSON.stringify(formData));
    else if (action === "draft")
      alert("Form saved as draft: " + JSON.stringify(formData));
    else if (action === "restart") {
      setFormData({ demographic: {}, agricultural: {}, land: {} });
      setActiveTab(1);
    }
  };

  return (
    <div className="main-form-container">
      
      <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="form-content">
        {activeTab === 1 && (
          <DemographicForm onSubmit={handleDemographicSubmit} />
        )}
        {activeTab === 2 && (
          <AgriculturalForm onSubmit={handleAgriculturalSubmit} />
        )}
        {activeTab === 3 && (
          <LandForm
            onSubmit={handleLandSubmit}
            onFinalAction={handleFinalAction}
          />
        )}
      </div>
    </div>
  );
};

export default MainFormPage;
