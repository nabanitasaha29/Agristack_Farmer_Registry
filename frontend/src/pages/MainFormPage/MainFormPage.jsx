import React, { useState, useRef } from "react";
import "./MainFormPage.css";
import DemographicForm from "../../components/forms/DemographicForm";
import AgriculturalForm from "../../components/forms/AgriculturalForm";
import LandForm from "../../components/forms/LandForm";
import TabsNavigation from "../../components/TabsNavigation";
import { message } from "antd";

const MainFormPage = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    demographic: {},
    agricultural: {},
    land: {},
  });

  // Create refs for each form
  const demographicFormRef = useRef(null);
  const landFormRef = useRef(null);
  const agriculturalFormRef = useRef(null);

  const handleTabChange = async (newTab) => {
    try {
      // Validate current form before switching tabs
      if (activeTab === 1 && demographicFormRef.current) {
        await demographicFormRef.current.validateFields();
        const demoValues = demographicFormRef.current.getFieldsValue();
        setFormData(prev => ({ ...prev, demographic: demoValues }));
      } 
      else if (activeTab === 2 && landFormRef.current) {
        await landFormRef.current.validateFields();
        const landValues = landFormRef.current.getFieldsValue();
        setFormData(prev => ({ ...prev, land: landValues }));
      }
      else if (activeTab === 3 && agriculturalFormRef.current) {
        await agriculturalFormRef.current.validateFields();
        const agriValues = agriculturalFormRef.current.getFieldsValue();
        setFormData(prev => ({ ...prev, agricultural: agriValues }));
      }
      
      setActiveTab(newTab);
    } catch (error) {
      message.error('Please fill all required fields before proceeding');
    }
  };
  const handleDemographicSubmit = (data) => {
    setFormData((prev) => ({ ...prev, demographic: data }));
    if (activeTab === 1) setActiveTab(2);
  };

  const handleLandSubmit = (data) => {
    setFormData((prev) => ({ ...prev, land: data }));
    if (activeTab === 2) setActiveTab(3);
  };

  const handleAgriculturalSubmit = (data) => {
    setFormData((prev) => ({ ...prev, agricultural: data }));
  };

  const handleFinalAction = (action) => {
    if (action === "submit") {
      // First save any unsaved agricultural form data
      if (agriculturalFormRef.current) {
        agriculturalFormRef.current.submit();
      }
      
      // Combine all form data
      const completeFormData = {
        ...formData.demographic,
        ...formData.land,
        ...formData.agricultural,
      };
      console.log("Final form data:", completeFormData);
      alert("Form submitted: " + JSON.stringify(completeFormData, null, 2));
    } else if (action === "draft") {
      if (agriculturalFormRef.current) {
        agriculturalFormRef.current.submit();
      }
      alert("Form saved as draft: " + JSON.stringify(formData, null, 2));
    } else if (action === "restart") {
      setFormData({ demographic: {}, agricultural: {}, land: {} });
      setActiveTab(1);
    }
  };

   return (
    <div className="main-form-container">
      <TabsNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      <div className="form-content">
        {activeTab === 1 && (
          <DemographicForm 
            ref={demographicFormRef}
            onSubmit={handleDemographicSubmit}
            initialValues={formData.demographic}
          />
        )}
        {activeTab === 2 && (
          <LandForm 
            ref={landFormRef}
            onSubmit={handleLandSubmit}
            initialValues={formData.land}
          />
        )}
        {activeTab === 3 && (
          <AgriculturalForm
            ref={agriculturalFormRef}
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