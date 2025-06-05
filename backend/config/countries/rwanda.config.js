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
