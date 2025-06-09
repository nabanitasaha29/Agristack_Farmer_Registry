import express from "express";

import { getLocationHierarchy } from "../services/locationService.js";
import { getLocationData } from "../services/locationService.js";
import { countryConfigs } from "../config/index.js";

const router = express.Router();

router.get("/hierarchy", async (req, res) => {
  try {
    const hierarchy = await getLocationHierarchy();
    res.json({
      countryCode: process.env.ACTIVE_COUNTRY || "IN", // Return active country code
      hierarchy,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hierarchy" });
  }
});

//Data for Dropdowns
router.get("/location-options", async (req, res) => {
  try {
    const { levelName, parentValue } = req.query;

    if (!levelName) {
      return res.status(400).json({ error: "Missing levelName query param" });
    }

    const options = await getLocationData(levelName, parentValue);
    res.json({ countryCode: process.env.ACTIVE_COUNTRY || "IN", options });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To get country code for Mobile number in DemographicFrom
router.get("/active-country", (req, res) => {
  res.json({ countryCode: process.env.ACTIVE_COUNTRY || "IN" });
});

router.get("/mobile-code", (req, res) => {
  const activeCountry = process.env.ACTIVE_COUNTRY || "IN";
  const config = countryConfigs[activeCountry];

  if (!config || !config.mobileCode) {
    return res
      .status(404)
      .json({ error: "Mobile code not found for active country" });
  }

  res.json({ mobileCode: config.mobileCode });
});

// To get area unit
router.get("/area-unit", (req, res) => {
  const activeCountry = process.env.ACTIVE_COUNTRY || "IN";
  const config = countryConfigs[activeCountry];

  if (!config || !config.areaUnit) {
    return res
      .status(404)
      .json({ error: "Area unit not found for active country" });
  }

  res.json({ areaUnit: config.areaUnit });
});


// Add this new route
router.get("/id-proof-types", (req, res) => {
  const activeCountry = process.env.ACTIVE_COUNTRY || "IN";
  const config = countryConfigs[activeCountry];

  if (!config || !config.idProofTypes) {
    return res
      .status(404)
      .json({ error: "ID proof types not found for active country" });
  }

  res.json({
    countryCode: activeCountry,
    idProofTypes: config.idProofTypes
  });
});


// Add this new route to get full country config
router.get("/config", (req, res) => {
  res.json({
    countryConfigs: countryConfigs
  });
});

// New route: Social categories
router.get("/social-categories", (req, res) => {
  const activeCountry = process.env.ACTIVE_COUNTRY || "IN";
  const config = countryConfigs[activeCountry];

  if (!config || !config.socialCategories) {
    return res
      .status(404)
      .json({ error: "Social categories not found for active country" });
  }

  res.json({
    countryCode: activeCountry,
    socialCategories: config.socialCategories,
  });
});







// New route for postal code config
router.get("/postal-code-config", (req, res) => {
  const activeCountry = process.env.ACTIVE_COUNTRY || "IN";
  const config = countryConfigs[activeCountry];

  if (!config || !config.postalCodeConfig) {
    return res
      .status(404)
      .json({ error: "Postal code config not found for active country" });
  }

  res.json({
    countryCode: activeCountry,
    postalCodeConfig: config.postalCodeConfig,
  });
});




// New route for land identifiers
router.get("/land-identifiers", (req, res) => {
  const activeCountry = process.env.ACTIVE_COUNTRY || "IN";
  const config = countryConfigs[activeCountry];

  if (!config || !config.landIdentifiers) {
    return res
      .status(404)
      .json({ error: "Land identifiers not found for active country" });
  }

  res.json({
    countryCode: activeCountry,
    landIdentifiers: config.landIdentifiers,
  });
});



export default router;
