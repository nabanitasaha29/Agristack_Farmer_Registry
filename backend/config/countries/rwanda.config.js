export const rwandaHierarchy = [
  { levelOrder: 1, levelName: "Province", parentLevel: null },
  { levelOrder: 2, levelName: "District", parentLevel: "Province" },
  { levelOrder: 3, levelName: "Sector", parentLevel: "District" },
  { levelOrder: 4, levelName: "Cell", parentLevel: "Sector" },
  { levelOrder: 5, levelName: "Village", parentLevel: "Cell" },
];
export const rwandaConfig = {
  areaUnit: "acres",
  mobileCode: "250",
  tableName: "rwanda_location_data",
  idProofTypes: [
    { value: "NID", label: "National Identification Card" },
    { value: "Passport", label: "Passport" },
    { value: "DrivingLicense", label: "Driving License" },
    { value: "VoterCard", label: "Voter's Card" }
  ],
  socialCategories: [
    { value: "CATEGORY_1", label: "Ubudehe Category 1 (Very Poor)" },
    { value: "CATEGORY_2", label: "Ubudehe Category 2 (Poor)" },
    { value: "CATEGORY_3", label: "Ubudehe Category 3 (Middle Income)" },
    { value: "CATEGORY_4", label: "Ubudehe Category 4 (Relatively Wealthy)" }
  ],
  landIdentifiers: [
    { name: "UPI (Unique Parcel Identifier)", required: true },
    { name: "Land Title Number", required: true },
    { name: "Plot Number", required: false }
  ],


  columns: {
    Province: "province_name",
    District: "district_name",
    Sector: "sector_name",
    Cell: "cell_name",
    Village: "village_name",
  },
  parentColumns: {
    District: "province_name",
    Sector: "district_name",
    Cell: "sector_name",
    Village: "cell_name",
  },
};
