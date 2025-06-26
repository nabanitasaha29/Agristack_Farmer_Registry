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
  const activeCountry = country || "IN";
  const config = countryConfigs[activeCountry];
  if (!config) {
    throw new Error(`Config not found for country ${activeCountry}`);
  }

  const { tableName, columns, parentColumns } = config;

  // Get the level order from the hierarchy
  const hierarchy = await getLocationHierarchy(activeCountry);
  const levelInfo = hierarchy.find(level => level.level_name === levelName);
  
  if (!levelInfo) {
    throw new Error(`Level info not found for ${levelName}`);
  }

  const levelOrder = levelInfo.level_order;
  const columnName = columns[levelName];
  const codeColumn = `level_${levelOrder}_code`; // Use the level order to construct column name
  
  if (!columnName) {
    throw new Error(`Column mapping not found for level ${levelName}`);
  }

  // Modify query to select both name and code
  let query = `SELECT DISTINCT ${columnName} AS name, ${codeColumn} AS code FROM ${tableName} WHERE country_code = $1`;
  const params = [activeCountry];

  if (parentValue) {
    const parentColumn = parentColumns[levelName];
    if (!parentColumn) {
      throw new Error(
        `Parent column mapping not found for level ${levelName} when filtering by parent`
      );
    }
    query += ` AND ${parentColumn} = $2`;
    params.push(parentValue);
  }

  query += ` ORDER BY ${columnName} ASC`;

  try {
    const { rows } = await pool.query(query, params);
    
    // Return both name and code
    return rows.map(row => ({
      name: row.name,
      code: row.code
    }));
  } catch (err) {
    console.error(`Error fetching location data for ${levelName}:`, err.message);
    throw err;
  }
}