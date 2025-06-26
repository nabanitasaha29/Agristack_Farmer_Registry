export const nigeriaHierarchy = [
  { levelOrder: 1, levelName: "State", parentLevel: null },
  { levelOrder: 2, levelName: "LocalGovernmentArea", parentLevel: "State" },
  { levelOrder: 3, levelName: "Ward", parentLevel: "LocalGovernmentArea" },
];
// New export: table and column mappings
export const nigeriaConfig = {
  landId: "fr_land_id",
  landIdentifiersMapping: {
    identifier1: "fr_survey_plan_number",
    identifier2: "fr_plot_number",
    identifier3: "fr_block_number",
  },
  area: "fr_land_area",
  areaUnitMapping: "fr_area_unit",
  geometry: "fr_land_geometry",
  location: {
    level_1_name: "fr_state",
    level_2_name: "fr_lga",
    level_3_name: "fr_ward",
  },
  locationIds: {
    level_1_id: "fr_state_id",
    level_2_id: "fr_lga_id",
    level_3_id: "fr_ward_id",
  },
  areaUnit: "hectares",
  mobileCode: "234",
  // tableName: "nigeria_location_lgd", // your actual Nigeria location data table
  tableName: "country_agnostik_location_master",
  dateFormat: "DD/MM/YYYY",
  idProofTypes: [
    { value: "NIN", label: "National Identity Number (NIN)" },
    { value: "VoterCard", label: "Permanent Voter's Card" },
    { value: "DriversLicense", label: "Driver's License" },
    { value: "Passport", label: "International Passport" },
  ],
  socialCategories: [
    { value: "GEN", label: "General" },
    { value: "DISADVANTAGED", label: "Disadvantaged Group" },
    { value: "WIDOWS", label: "Widows" },
    { value: "PWD", label: "Persons with Disabilities" },
    { value: "YOUTH", label: "Youth" },
    { value: "ELDERLY", label: "Elderly" },
  ],
  landIdentifiers: [
    { name: "Survey Plan Number", required: true },
    { name: "Plot Number", required: true },
    { name: "Block Number", required: false },
  ],
  postalCodeConfig: {
    label: "Postal Code",
    length: 6,
    regex: "^[0-9]{6}$", // Nigeria's NIPOST codes
    required: true,
  },



  columns: {
    State: "level_1_name",
    LocalGovernmentArea: "level_2_name",
    Ward: "level_3_name",
  },
  parentColumns: {
    LocalGovernmentArea: "level_1_name",
    Ward: "level_2_name",
  },
};
