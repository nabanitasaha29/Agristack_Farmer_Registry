import express from "express";
import { submitFarmerData } from "../controller/farmerController.js";

const router = express.Router();

router.post("/register", submitFarmerData);

export default router;
