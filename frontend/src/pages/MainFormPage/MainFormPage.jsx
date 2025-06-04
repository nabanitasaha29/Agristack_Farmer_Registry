import React, { useState } from "react";
import moment from "moment"; // Ensure it's installed via: npm install moment
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

  const handleFinalAction = async (action) => {
    if (action === "submit") {
      const { demographic, land, agricultural } = formData;

      const selectedLocation = demographic.selectedLocation || {};
      const landLocation = land.landLocation || {};

      const demographicPayload = {
        fr_full_name: demographic.fr_full_name || "",
        fr_local_language_name: demographic.fr_local_language_name || "",
        fr_dob: demographic.fr_dob
          ? moment(demographic.fr_dob).format("YYYY-MM-DD")
          : "",
        fr_gender: demographic.fr_gender || "",
        fr_social_category: demographic.fr_social_category || "",
        fr_email: demographic.fr_email || "",
        fr_id_proof_type: demographic.fr_id_proof_type || "",
        fr_id_proof_number: demographic.fr_id_proof_number || "",
        fr_mobile_number: demographic.fr_mobile_number
          ? demographic.fr_mobile_number.replace(/\D/g, "")
          : "",
        fr_address_line_1: demographic.fr_address_line_1 || "",
        fr_address_line_2: demographic.fr_address_line_2 || "",
        fr_local_language_address: demographic.fr_local_language_address || "",
        fr_postal_code: demographic.fr_postal_code || "",
        fr_country: selectedLocation.country || "India",
        fr_level_1_id: selectedLocation.State || "",
        fr_level_2_id: selectedLocation["Local Government"] || "",
        fr_level_3_id: selectedLocation.Ward || "",
        fr_level_4_id: selectedLocation["Village/Block"] || "",
        fr_level_5_id: selectedLocation["Sub-village"] || "",
        fr_level_6_id: selectedLocation["Hamlet"] || "",
      };

      const landEntry = {
        fr_land_identifier_1: land.fr_land_identifier_1 || "",
        fr_land_identifier_2: land.fr_land_identifier_2 || "",
        fr_land_identifier_3: land.fr_land_identifier_3 || "",
        fr_land_area: land.fr_land_area || 0,
        fr_area_unit: land.fr_area_unit || "Acre",
        fr_level_1_id: landLocation.State || "",
        fr_level_2_id: landLocation["Local Government"] || "",
        fr_level_3_id: landLocation.Ward || "",
        fr_level_4_id: landLocation["Village/Block"] || "",
        fr_level_5_id: landLocation["Sub-village"] || "",
        fr_level_6_id: landLocation["Hamlet"] || "",
      };

      const finalPayload = {
        demographic: demographicPayload,
        agricultural: {
          fr_farmer_type: agricultural.fr_farmer_type || "",
          fr_farmer_category: agricultural.fr_farmer_category || "",
          fr_total_land_area_owned: agricultural.fr_total_land_area_owned || "",
          fr_no_of_lands_owned: agricultural.fr_no_of_lands_owned || "",
        },
        land: {
          entries: [landEntry],
        },
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/farmer/register",
          finalPayload
        );
        alert("Form submitted successfully!");
        console.log("Server response:", response.data);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit form. Please try again.");
      }
    } else if (action === "draft") {
      alert("Form saved as draft:\n" + JSON.stringify(formData, null, 2));
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
          <LandForm onSubmit={handleLandSubmit} initialValues={formData.land} />
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