export const ethiopiaHierarchy = [
  { levelOrder: 1, levelName: "Region", parentLevel: null },
  { levelOrder: 2, levelName: "Zone", parentLevel: "Region" },
  { levelOrder: 3, levelName: "Woreda", parentLevel: "Zone" },
  { levelOrder: 4, levelName: "Kebele", parentLevel: "Woreda" },
];

export const ethiopiaConfig = {
  areaUnit: "hectares",
  mobileCode: "251",
  tableName: "ethiopia_location_data",
  columns: {
    Region: "region_name",
    Zone: "zone_name",
    Woreda: "woreda_name",
    Kebele: "kebele_name",
  },
  parentColumns: {
    Zone: "region_name",
    Woreda: "zone_name",
    Kebele: "woreda_name",
  },
};
