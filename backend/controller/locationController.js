import { getLocationHierarchy } from '../services/locationService.js';

export async function fetchHierarchy(req, res) {
  const { countryCode } = req.query;
  if (!countryCode) {
    return res.status(400).json({ error: "Missing countryCode" });
  }

  const hierarchy = await getLocationHierarchy(countryCode);
  res.json({ countryCode, hierarchy });
}
