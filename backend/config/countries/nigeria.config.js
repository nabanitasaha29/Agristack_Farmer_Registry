export const nigeriaHierarchy = [
  { levelOrder: 1, levelName: "State", parentLevel: null },
  { levelOrder: 2, levelName: "Local Government", parentLevel: "State" },
  { levelOrder: 3, levelName: "Ward", parentLevel: "Local Government" },
];
// New export: table and column mappings
export const nigeriaConfig = {
  areaUnit: "hectares",
  mobileCode: "234",
  tableName: "nigeria_location_lgd", // your actual Nigeria location data table
  idProofTypes: [
    { value: "NIN", label: "National Identity Number (NIN)" },
    { value: "VoterCard", label: "Permanent Voter's Card" },
    { value: "DriversLicense", label: "Driver's License" },
    { value: "Passport", label: "International Passport" }
  ],
  columns: {
    State: "state_name",
    "Local Government": "local_govt_name",
    Ward: "ward_name",
  },
  parentColumns: {
    "Local Government": "state_name",
    Ward: "local_govt_name",
  },
};
