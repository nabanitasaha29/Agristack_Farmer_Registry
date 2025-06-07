export const indiaHierarchy = [
  { levelOrder: 1, levelName: "State", parentLevel: null },
  { levelOrder: 2, levelName: "District", parentLevel: "State" },
  { levelOrder: 3, levelName: "Subdistrict", parentLevel: "District" },
  { levelOrder: 4, levelName: "Village", parentLevel: "Subdistrict" },
];
export const indiaConfig = {
  areaUnit: "hectares",
  mobileCode: "91",
  // tableName: "lgd_master",
  tableName: "country_agnostik_location_master",
  idProofTypes: [
    { value: "Aadhaar", label: "Aadhaar Card" },
    { value: "PAN", label: "PAN Card" },
    { value: "VoterID", label: "Voter ID" },
    { value: "DrivingLicense", label: "Driving License" },
    { value: "Passport", label: "Passport" },
  ],
  socialCategories: [
    { value: "GEN", label: "General" },
    { value: "OBC", label: "Other Backward Class" },
    { value: "SC", label: "Scheduled Caste" },
    { value: "ST", label: "Scheduled Tribe" },
    { value: "OTHER", label: "Other" },
  ],
  landIdentifiers: [
    { name: "Survey Number", required: true },
    { name: "Sub-Division Number", required: false },
    { name: "Plot Number", required: true },
  ],
  postalCodeConfig: {
    label: "PIN Code",
    length: 6,
    regex: "^[1-9][0-9]{5}$", // e.g., 560001
    required: true,
  },
  // columns: {
  //   State: "state_name",
  //   District: "district_name",
  //   Subdistrict: "sub_district_name",
  //   Village: "village_name",
  // },
  // parentColumns: {
  //   District: "state_name",
  //   Subdistrict: "district_name",
  //   Village: "sub_district_name",
  // },

  columns: {
    State: "level_1_name",
    District: "level_2_name",
    Subdistrict: "level_3_name",
    Village: "level_4_name",
  },
  parentColumns: {
    District: "level_1_name",
    Subdistrict: "level_2_name",
    Village: "level_3_name",
  },
};
