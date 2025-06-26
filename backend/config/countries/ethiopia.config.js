export const ethiopiaHierarchy = [
  { levelOrder: 1, levelName: "Region", parentLevel: null },
  { levelOrder: 2, levelName: "Zone", parentLevel: "Region" },
  { levelOrder: 3, levelName: "Woreda", parentLevel: "Zone" },
  { levelOrder: 4, levelName: "Kebele", parentLevel: "Woreda" },
];

export const ethiopiaConfig = {
  landId: "fr_land_id",
  landIdentifiersMapping: {
    identifier1: "fr_parcel_number",
    identifier2: "fr_holding_number",
    identifier3: "fr_kebele_registration_id",
  },
  area: "fr_land_area",
  areaUnitMapping: "fr_area_unit",
  geometry: "fr_land_geometry",
  location: {
    level_1_name: "fr_region",
    level_2_name: "fr_zone",
    level_3_name: "fr_woreda",
    level_4_name: "fr_kebele",
  },
  locationIds: {
    level_1_id: "fr_region_id",
    level_2_id: "fr_zone_id",
    level_3_id: "fr_woreda_id",
    level_4_name: "fr_kebele_id",
  },
  areaUnit: "hectares",
  mobileCode: "251",
  // tableName: "ethiopia_location_data",
  tableName: "country_agnostik_location_master",
  dateFormat: "DD/MM/YYYY",
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
