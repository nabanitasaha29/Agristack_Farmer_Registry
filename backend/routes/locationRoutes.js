import express from "express";

import { getLocationHierarchy } from "../services/locationService.js";

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

export default router;
