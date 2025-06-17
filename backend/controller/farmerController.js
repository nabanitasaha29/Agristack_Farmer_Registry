import db from "../config/db.js";

export const submitFarmerData = async (req, res) => {
  const { demographic, agricultural, land } = req.body;

  const createdBy =
    demographic?.created_by?.trim() !== "" ? demographic.created_by : "system";

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const insertFarmerQuery = `
      INSERT INTO fr_farmer_details (
        fr_full_name, fr_local_language_name, fr_dob, fr_gender,
        fr_social_category, fr_email, fr_id_proof_type, fr_id_proof_number,
        fr_mobile_number, fr_address_line_1, fr_address_line_2, fr_local_language_address,
        fr_postal_code, fr_country,
        fr_level_1_id, fr_level_2_id, fr_level_3_id, fr_level_4_id,
        fr_level_5_id, fr_level_6_id,
        fr_farmer_type, fr_farmer_category, fr_total_land_area_owned, fr_no_of_lands_owned,
        created_by, created_at, modified_by, modified_at, reg_status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,
        $19,$20,$21,$22,$23,$24,$25,$26,
        $27,$28,$29
      )
      RETURNING fr_farmer_id
    `;

    const values = [
      demographic.fr_full_name,
      demographic.fr_local_language_name,
      demographic.fr_dob,
      demographic.fr_gender,
      demographic.fr_social_category,
      demographic.fr_email,
      demographic.fr_id_proof_type,
      demographic.fr_id_proof_number,
      demographic.fr_mobile_number,
      demographic.fr_address_line_1,
      demographic.fr_address_line_2,
      demographic.fr_local_language_address,
      demographic.fr_postal_code,
      process.env.ACTIVE_COUNTRY || "IN",
      demographic.fr_level_1_id,
      demographic.fr_level_2_id,
      demographic.fr_level_3_id,
      demographic.fr_level_4_id,
      demographic.fr_level_5_id,
      demographic.fr_level_6_id,
      agricultural.fr_farmer_type,
      agricultural.fr_farmer_category,
      agricultural.fr_total_land_area_owned,
      agricultural.fr_no_of_lands_owned,
      createdBy,
      new Date(), // created_at
      null, // modified_by
      null, // modified_at
      null, // reg_status
    ];

    const farmerResult = await client.query(insertFarmerQuery, values);
    const farmerId = farmerResult.rows[0].fr_farmer_id;

    if (land?.entries?.length) {
      for (const entry of land.entries) {
        await client.query(
          `INSERT INTO fr_land_details (
            fr_farmer_id,
            fr_land_identifier_1, fr_land_identifier_2, fr_land_identifier_3,
            fr_land_area, fr_area_unit,
            fr_level_1_id, fr_level_2_id, fr_level_3_id,
            fr_level_4_id, fr_level_5_id, fr_level_6_id
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [
            farmerId,
            entry.fr_land_identifier_1,
            entry.fr_land_identifier_2,
            entry.fr_land_identifier_3,
            entry.fr_land_area,
            entry.fr_area_unit,
            entry.fr_level_1_id,
            entry.fr_level_2_id,
            entry.fr_level_3_id,
            entry.fr_level_4_id,
            entry.fr_level_5_id,
            entry.fr_level_6_id,
          ]
        );
      }
    }

    await client.query("COMMIT");
    res.status(200).json({ message: " Farmer registered", farmerId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(" Error submitting farmer:", err.message);
    res.status(500).json({ message: " Server error", error: err.message });
  } finally {
    client.release();
  }
};
