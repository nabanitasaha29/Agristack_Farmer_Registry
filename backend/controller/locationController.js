import {
  getLocationHierarchy,
  getLocationData,
} from "../services/locationService.js";

export async function fetchHierarchy(req, res) {
  const { countryCode } = req.query;
  if (!countryCode) {
    return res.status(400).json({ error: "Missing countryCode" });
  }

  const hierarchy = await getLocationHierarchy(countryCode);
  res.json({ countryCode, hierarchy });
}

export async function fetchOptionsForlevel(req, res) {
  const { levelName, parentValue } = req.query;

  if (!levelName) {
    return res.status(400).json({ error: "Missing levelName" });
  }

  const options = await getLocationData(levelName, parentValue);
  res.json({ countryCode, options });
}
