export const ethiopiaHierarchy = [
  { levelOrder: 1, levelName: "Region", parentLevel: null },
  { levelOrder: 2, levelName: "Zone", parentLevel: "Region" },
  { levelOrder: 3, levelName: "Woreda", parentLevel: "Zone" },
  { levelOrder: 4, levelName: "Kebele", parentLevel: "Woreda" },
];

export const ethiopiaConfig = {
  areaUnit: "hectares",
  mobileCode: "251",
  // tableName: "ethiopia_location_data",
  tableName: "country_agnostik_location_master",
  idProofTypes: [
    { value: "KebeleID", label: "Kebele ID Card" },
    { value: "Passport", label: "Passport" },
    { value: "DrivingLicense", label: "Driving License" },
    { value: "VoterCard", label: "Voter's Card" },
  ],
  socialCategories: [
    { value: "GEN", label: "General" },
    { value: "PASTORALIST", label: "Pastoralist Community" },
    { value: "AGRICULTURALIST", label: "Agriculturalist Community" },
    { value: "WOMEN_HEAD", label: "Women-Headed Household" },
    { value: "PWD", label: "Persons with Disabilities" },
  ],
  landIdentifiers: [
    { name: "Parcel Number", required: true },
    { name: "Holding Number", required: false },
    { name: "Kebele Registration ID", required: true },
  ],
  postalCodeConfig: {
    label: "Postal Code",
    length: 4,
    regex: "^[0-9]{4}$", // Ethiopia uses 4-digit codes
    required: false,
  },
  // columns: {
  //   Region: "region_name",
  //   Zone: "zone_name",
  //   Woreda: "woreda_name",
  //   Kebele: "kebele_name",
  // },
  // parentColumns: {
  //   Zone: "region_name",
  //   Woreda: "zone_name",
  //   Kebele: "woreda_name",
  // },

  columns: {
    Region: "level_1_name",
    Zone: "level_2_name",
    Woreda: "level_3_name",
    Kebele: "level_4_name",
  },
  parentColumns: {
    Zone: "level_1_name",
    Woreda: "level_2_name",
    Kebele: "level_3_name",
  },
};
