import React from "react";
import "./LandingPage.css";
import MainFormPage from "../MainFormPage/MainFormPage";

const LandingPage = () => {
  return (
    <>
    <div className="landing-page-container">
      <h1 className="landing-page-title">Farmer Registration</h1>
      <p className="landing-page-description">
        Welcome to the Farmer Registration app!
      </p>
    </div>
    <MainFormPage/>
    </>
  );
};

export default LandingPage;
