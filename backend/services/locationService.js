// import { pool } from "../config/db.js";
import pool from "../config/db.js";

import { fallbackHierarchy, country, countryConfigs } from "../config/index.js"; // Import 'country' as active country

// export async function getLocationHierarchy() {
// const activeCountry = country || "IN"; // Use 'country' from env/config or default to 'IN'
export async function getLocationHierarchy(inputCountry) {
  const selectedCountry = inputCountry || country || "IN";

  const query = `
    SELECT level_order, level_name, parent_level
    FROM location_hierarchy
    WHERE country_code = $1
    ORDER BY level_order
  `;
  try {
    // const { rows } = await pool.query(query, [activeCountry]);
    const { rows } = await pool.query(query, [selectedCountry]);

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

// New function to fetch actual location data for a level dropdowns
// Function to fetch location data (e.g., State, District, etc.) based on level and optionally filtered by parent
export async function getLocationData(levelName, parentValue = null) {
  // Get the active country code (e.g., 'IN', 'NG') from environment or default to 'IN'
  const activeCountry = country || "IN";

  // Fetch country-specific configuration from config file
  const config = countryConfigs[activeCountry];
  if (!config) {
    throw new Error(`Config not found for country ${activeCountry}`);
  }

  // Destructure required details from the config
  const { tableName, columns, parentColumns } = config;

  // Get the actual DB column name for the requested level (e.g., levelName = "District" → "level_2_name")
  const columnName = columns[levelName];
  if (!columnName) {
    throw new Error(`Column mapping not found for level ${levelName}`);
  }

  // Base query to fetch distinct names from the location table, filtered by country code
  let query = `SELECT DISTINCT ${columnName} AS name FROM ${tableName} WHERE country_code = $1`;
  const params = [activeCountry]; // First parameter is always the country_code

  // If a parent location is provided (e.g., selected state while fetching districts), add a filter
  if (parentValue) {
    const parentColumn = parentColumns[levelName];
    if (!parentColumn) {
      throw new Error(
        `Parent column mapping not found for level ${levelName} when filtering by parent`
      );
    }

    // Add parent column condition (e.g., WHERE district.state_name = 'Maharashtra')
    query += ` AND ${parentColumn} = $2`;
    params.push(parentValue);
  }

  // Order the result alphabetically for consistent dropdown display
  query += ` ORDER BY ${columnName} ASC`;

  try {
    // Execute the query using the connection pool
    const { rows } = await pool.query(query, params);

    // Return only the name values as a flat array
    return rows.map((row) => row.name);
  } catch (err) {
    // Log and re-throw error for upstream handling
    console.error(
      `Error fetching location data for ${levelName}:`,
      err.message
    );
    throw err;
  }
}
