import { pool } from "../config/db.js";
import { fallbackHierarchy, country, countryConfigs } from "../config/index.js"; // Import 'country' as active country

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

// New function to fetch actual location data for a level
export async function getLocationData(levelName, parentValue = null) {
  const activeCountry = country || "IN";

  const config = countryConfigs[activeCountry];
  if (!config) {
    throw new Error(`Config not found for country ${activeCountry}`);
  }

  const { tableName, columns, parentColumns } = config;

  const columnName = columns[levelName];
  if (!columnName) {
    throw new Error(`Column mapping not found for level ${levelName}`);
  }

  let query = `SELECT DISTINCT ${columnName} AS name FROM ${tableName}`;
  const params = [];

  if (parentValue) {
    const parentColumn = parentColumns[levelName];
    if (!parentColumn) {
      throw new Error(
        `Parent column mapping not found for level ${levelName} when filtering by parent`
      );
    }
    query += ` WHERE ${parentColumn} = $1`;
    params.push(parentValue);
  }

  query += ` ORDER BY ${columnName} ASC`;

  try {
    const { rows } = await pool.query(query, params);
    return rows.map((row) => row.name);
  } catch (err) {
    console.error(
      `Error fetching location data for ${levelName}:`,
      err.message
    );
    throw err;
  }
}
