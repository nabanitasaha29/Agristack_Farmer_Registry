import React, { useState, useRef, useEffect } from "react";
//import moment from "moment";
import axios from "axios";
import { message, Spin, Modal } from "antd";
import dayjs from "dayjs";
import DemographicForm from "../../components/forms/DemographicForm";
import AgriculturalForm from "../../components/forms/AgriculturalForm";
import LandForm from "../../components/forms/LandForm";
import TabsNavigation from "../../components/TabsNavigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import "./MainFormPage.css";

const MainFormPage = () => {
  //const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const { username } = useAuth();
  console.log("Current logged-in username:", username);

  useEffect(() => {
    console.log("Auth loaded, username:", username);
  }, [username]);
  const [formData, setFormData] = useState({
    demographic: {},
    agricultural: {},
    land: { entries: [] },
  });

  const formRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
  };

  const validateAndSaveCurrentForm = async () => {
    const currentFormRef = formRefs[activeTab];
    if (!currentFormRef?.current) return true;

    try {
      await currentFormRef.current.validateFields();
      const formValues = currentFormRef.current.getFieldsValue();
      if (activeTab === 1 && formValues.fr_mobile_number) {
        const prevMobile = formData.demographic.fr_mobile_number || "";
        if (prevMobile.startsWith("+")) {
          formValues.fr_mobile_number = prevMobile;
        }
      }
      if (activeTab === 2 && formValues.lands) {
        formValues.entries = formValues.lands;
      }

      setFormData((prev) => ({
        ...prev,
        ...(activeTab === 1 && { demographic: formValues }),
        ...(activeTab === 2 && { land: formValues }),
        ...(activeTab === 3 && { agricultural: formValues }),
      }));

      return true;
    } catch (error) {
      message.error("Please fill all required fields before proceeding.");
      return false;
    }
  };

  const handleTabChange = async (newTab) => {
    const isValid = await validateAndSaveCurrentForm();
    if (isValid) setActiveTab(newTab);
  };

  const handleDemographicSubmit = (data) => {
    setFormData((prev) => ({ ...prev, demographic: data }));
    setActiveTab(2);
  };

  const handleLandSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      land: {
        ...data,
        entries: data.lands || prev.land.entries || [],
      },
    }));
    setActiveTab(3);
  };

  const handleAgriculturalSubmit = (data) => {
    setFormData((prev) => ({ ...prev, agricultural: data }));
  };

  const calculateAgriculturalData = (landEntries) => {
    if (!landEntries || landEntries.length === 0) {
      return {
        fr_no_of_lands_owned: 0,
        fr_total_land_area_owned: "0.00",
        fr_farmer_category: "Small",
      };
    }

    const totalArea = landEntries.reduce(
      (sum, land) => sum + (parseFloat(land.fr_land_area) || 0),
      0
    );
    const landCount = landEntries.length;

    let farmerCategory = "Small";
    if (totalArea > 10) farmerCategory = "Large";
    else if (totalArea > 5) farmerCategory = "Medium";

    return {
      fr_no_of_lands_owned: landCount,
      fr_total_land_area_owned: totalArea.toFixed(2),
      fr_farmer_category: farmerCategory,
    };
  };

  const handleFinalAction = async (action) => {
    if (action === "submit") {
      setLoading(true);

      const { demographic, land } = formData;
      let agricultural = formData.agricultural;

      try {
        if (formRefs[3]?.current) {
          const validated = await formRefs[3].current.validateFields();
          agricultural = validated;
        }

        const locationLevels = demographic.locationLevels || {};
        const landEntries = land.entries || [];

        const fr_farmer_id = demographic.fr_farmer_id;

        const demographicPayload = {
          fr_farmer_id: fr_farmer_id,
          fr_full_name: demographic.fr_full_name || "",
          fr_local_language_name: demographic.fr_local_language_name || "",
          fr_dob: demographic.fr_dob || "",
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
          fr_local_language_address:
            demographic.fr_local_language_address || "",
          fr_postal_code: demographic.fr_postal_code || "",

          created_by: username ?? "system",
          created_at: new Date().toISOString(),
          modified_by: null,
          modified_at: null,
          reg_status: null,
        };

        Object.keys(locationLevels).forEach((key, index) => {
          demographicPayload[`fr_level_${index + 1}_id`] = locationLevels[key];
        });

        // Final combined payload
        const finalPayload = {
          demographic: demographicPayload,

          agricultural: {
            fr_farmer_id: fr_farmer_id,
            fr_farmer_type: agricultural.fr_farmer_type || "",
            fr_farmer_category: agricultural.fr_farmer_category || "",
            fr_total_land_area_owned:
              agricultural.fr_total_land_area_owned || "",
            fr_no_of_lands_owned: agricultural.fr_no_of_lands_owned || 0,
          },
          land: {
            entries: landEntries.map((entry) => ({
              fr_farmer_id: fr_farmer_id,
              fr_land_identifier_1: entry.fr_land_identifier_1 || "",
              fr_land_identifier_2: entry.fr_land_identifier_2 || "",
              fr_land_identifier_3: entry.fr_land_identifier_3 || "",
              fr_land_area: entry.fr_land_area || 0,
              fr_area_unit: entry.fr_area_unit || "Acre",
              fr_level_1_id: entry.landLocation?.level_1_name || "",
              fr_level_2_id: entry.landLocation?.level_2_name || "",
              fr_level_3_id: entry.landLocation?.level_3_name || "",
              fr_level_4_id: entry.landLocation?.level_4_name || "",
              fr_level_5_id: entry.landLocation?.level_5_name || "",
              fr_level_6_id: entry.landLocation?.level_6_name || "",
            })),
          },
        };

        // Make a single request if your backend accepts everything together:
        const response = await axios.post(
          "http://localhost:5000/api/farmer/register",
          finalPayload
        );
        //const farmerId = response.data.farmerId;
        console.log("Final Payload:", finalPayload);

        // message.success("Form submitted successfully!");
        Modal.success({
          title: "Registration Successful",
          content: (
            <div>
              <p>You have successfully registered.</p>
              <p>
                Your credentials will be shared with you once your registration
                is approved. An SMS will be sent to your registered mobile
                number.
              </p>
            </div>
          ),
          okText: "Close",
        });

        console.log("Server response:", response.data);

        setFormData({
          demographic: {},
          agricultural: {},
          land: { entries: [] },
        });
        setActiveTab(1);
      } catch (error) {
        console.error("Submit error:", error);
        message.error("Failed to submit form. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (action === "draft") {
      message.info("Form saved as draft.");
      console.log("Draft data:", formData);
    } else if (action === "restart") {
      setFormData({ demographic: {}, agricultural: {}, land: { entries: [] } });
      setActiveTab(1);
      message.success("Form restarted.");
    }
  };

  return (
    <div className="main-form-container">
      <TabsNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="form-content">
        <Spin spinning={loading} tip="Submitting...">
          {activeTab === 1 && (
            <DemographicForm
              ref={formRefs[1]}
              onSubmit={handleDemographicSubmit}
              initialValues={{
                ...formData.demographic,
                fr_dob: formData.demographic.fr_dob
                  ? dayjs(formData.demographic.fr_dob, "YYYY-MM-DD")
                  : // ? dayjs(formData.demographic.fr_dob, formData.demographic.dateFormatUsed || 'YYYY-MM-DD')
                    null,
              }}
            />
          )}
          {activeTab === 2 && (
            <LandForm
              ref={formRefs[2]}
              onSubmit={handleLandSubmit}
              initialValues={{
                ...formData.land,
                lands: formData.land.entries,
              }}
            />
          )}
          {activeTab === 3 && (
            <AgriculturalForm
              ref={formRefs[3]}
              onSubmit={handleAgriculturalSubmit}
              onFinalAction={handleFinalAction}
              initialValues={{
                ...formData.agricultural,
                ...calculateAgriculturalData(formData.land.entries || []),
              }}
              landUnit={
                formData.land.entries?.[0]?.fr_area_unit
                  ? formData.land.entries[0].fr_area_unit
                  : "acres"
              }
            />
          )}
        </Spin>
      </div>
    </div>
  );
};

export default MainFormPage;
