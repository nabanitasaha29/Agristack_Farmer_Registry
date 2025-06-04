import React, { useState } from "react";
import "./MainFormPage.css";
import axios from "axios";
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
  const handleLandSubmit = (data) => {
    setFormData((prev) => ({ ...prev, land: data }));
    setActiveTab(3);
  };
  const handleAgriculturalSubmit = (data) => {
    setFormData((prev) => ({ ...prev, agricultural: data }));
  };

  const handleFinalAction = (action) => {
    console.log("📦 Final Form Data:", formData);
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
        {activeTab === 2 && <LandForm onSubmit={handleLandSubmit} />}
        {activeTab === 3 && (
          <AgriculturalForm
            onSubmit={handleAgriculturalSubmit}
            onFinalAction={handleFinalAction}
          />
        )}
      </div>
    </div>
  );
};

export default MainFormPage;
