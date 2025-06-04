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

  const handleLandSubmit = (data) => {
    setFormData((prev) => ({ ...prev, land: data }));
    setActiveTab(3);
  };

  const handleAgriculturalSubmit = (data) => {
    setFormData((prev) => ({ ...prev, agricultural: data }));
  };

  const handleFinalAction = (action) => {
    if (action === "submit") {
      // Combine all form data
      const completeFormData = {
        ...formData.demographic,
        ...formData.land,
        ...formData.agricultural,
      };
      console.log("Final form data:", completeFormData);
      alert("Form submitted: " + JSON.stringify(completeFormData, null, 2));
      
      // Here you would typically send to your backend
      // axios.post('/api/farmer-registration', completeFormData)
      //   .then(response => {
      //     console.log('Submission successful', response.data);
      //   })
      //   .catch(error => {
      //     console.error('Submission failed', error);
      //   });
    } else if (action === "draft") {
      alert("Form saved as draft: " + JSON.stringify(formData, null, 2));
    } else if (action === "restart") {
      setFormData({ demographic: {}, agricultural: {}, land: {} });
      setActiveTab(1);
    }
  };

  return (
    <div className="main-form-container">
      <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="form-content">
        {activeTab === 1 && (
          <DemographicForm 
            onSubmit={handleDemographicSubmit}
            initialValues={formData.demographic}
          />
        )}
        {activeTab === 2 && (
          <LandForm 
            onSubmit={handleLandSubmit}
            initialValues={formData.land}
          />
        )}
        {activeTab === 3 && (
          <AgriculturalForm
            onSubmit={handleAgriculturalSubmit}
            onFinalAction={handleFinalAction}
            initialValues={formData.agricultural}
          />
        )}
      </div>
    </div>
  );
};

export default MainFormPage;