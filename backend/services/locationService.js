import { pool } from "../config/db.js";
import { fallbackHierarchy, country } from "../config/index.js"; // Import 'country' as active country

export async function getLocationHierarchy() {
  const activeCountry = country || "IN"; // Use 'country' from env/config or default to 'IN'

  const query = `
    SELECT level_order, level_name, parent_level
    FROM location_hierarchy
    WHERE country_code = $1
    ORDER BY level_order
  `;
  try {
    const { rows } = await pool.query(query, [activeCountry]);
    if (rows.length > 0) {
      return rows; // DB data
    } else {
      console.warn(
        `No DB hierarchy found for ${activeCountry}. Falling back to config.`
      );
    }
  } catch (err) {
    console.error(`DB error for ${activeCountry}:`, err.message);
  }

  // Fallback config
  const configLevels =
    fallbackHierarchy[activeCountry] || fallbackHierarchy["IN"] || [];
  return configLevels;
}
