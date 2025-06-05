export const indiaHierarchy = [
  { levelOrder: 1, levelName: "State", parentLevel: null },
  { levelOrder: 2, levelName: "District", parentLevel: "State" },
  { levelOrder: 3, levelName: "Sub-District", parentLevel: "District" },
  { levelOrder: 4, levelName: "Village", parentLevel: "Sub-District" },
];
export const indiaConfig = {
  areaUnit: "hectares",
  mobileCode: "91",
  tableName: "lgd_master",
  idProofTypes: [
    { value: "Aadhaar", label: "Aadhaar Card" },
    { value: "PAN", label: "PAN Card" },
    { value: "VoterID", label: "Voter ID" },
    { value: "DrivingLicense", label: "Driving License" },
    { value: "Passport", label: "Passport" }
  ],
  landIdentifiers: [
    { name: "Survey Number", required: true },
    { name: "Sub-Division Number", required: false },
    { name: "Plot Number", required: true }
  ],
  columns: {
    State: "state_name",
    District: "district_name",
    "Sub-District": "sub_district_name",
    Village: "village_name",
  },
  parentColumns: {
    District: "state_name",
    "Sub-District": "district_name",
    Village: "sub_district_name",
  },
};
