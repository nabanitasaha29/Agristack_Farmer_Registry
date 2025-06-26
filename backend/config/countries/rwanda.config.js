export const rwandaHierarchy = [
  { levelOrder: 1, levelName: "Province", parentLevel: null },
  { levelOrder: 2, levelName: "District", parentLevel: "Province" },
  { levelOrder: 3, levelName: "Sector", parentLevel: "District" },
  { levelOrder: 4, levelName: "Cell", parentLevel: "Sector" },
  { levelOrder: 5, levelName: "Village", parentLevel: "Cell" },
];
export const rwandaConfig = {
  landId: "fr_land_id",
  landIdentifiersMapping: {
    identifier1: "fr_upi",
    identifier2: "fr_land_title_number",
    identifier3: "fr_plot_number",
  },
  area: "fr_land_area",
  areaUnitMapping: "fr_area_unit",
  geometry: "fr_land_geometry",
  location: {
    level_1_name: "fr_province",
    level_2_name: "fr_district",
    level_3_name: "fr_sector",
    level_4_name: "fr_cell",
    level_5_name: "fr_village",
  },
  locationIds: {
    level_1_id: "fr_province_id",
    level_2_id: "fr_district_id",
    level_3_id: "fr_sector_id",
    level_4_id: "fr_cell_id",
    level_5_id: "fr_village_id",
  },
  areaUnit: "acres",
  mobileCode: "250",
  // tableName: "rwanda_location_data",
  tableName: "country_agnostik_location_master",
  dateFormat: "DD/MM/YYYY",
  idProofTypes: [
    { value: "NID", label: "National Identification Card" },
    { value: "Passport", label: "Passport" },
    { value: "DrivingLicense", label: "Driving License" },
    { value: "VoterCard", label: "Voter's Card" },
  ],
  socialCategories: [
    { value: "CATEGORY_1", label: "Ubudehe Category 1 (Very Poor)" },
    { value: "CATEGORY_2", label: "Ubudehe Category 2 (Poor)" },
    { value: "CATEGORY_3", label: "Ubudehe Category 3 (Middle Income)" },
    { value: "CATEGORY_4", label: "Ubudehe Category 4 (Relatively Wealthy)" },
  ],
  landIdentifiers: [
    { name: "UPI (Unique Parcel Identifier)", required: true },
    { name: "Land Title Number", required: true },
    { name: "Plot Number", required: false },
  ],
  postalCodeConfig: {
    label: "Postal Code",
    length: 3,
    regex: "^[0-9]{3}$", // Rwanda uses 3-digit postal codes
    required: false,
  },

  // columns: {
  //   Province: "province_name",
  //   District: "district_name",
  //   Sector: "sector_name",
  //   Cell: "cell_name",
  //   Village: "village_name",
  // },
  // parentColumns: {
  //   District: "province_name",
  //   Sector: "district_name",
  //   Cell: "sector_name",
  //   Village: "cell_name",
  // },

  columns: {
    Province: "level_1_name",
    District: "level_2_name",
    Sector: "level_3_name",
    Cell: "level_4_name",
    Village: "level_5_name",
  },
  parentColumns: {
    District: "level_1_name",
    Sector: "level_2_name",
    Cell: "level_3_name",
    Village: "level_4_name",
  },
};
