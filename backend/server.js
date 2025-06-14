import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import locationRoutes from "./routes/locationRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/location", locationRoutes);
app.use("/api/farmer", farmerRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
