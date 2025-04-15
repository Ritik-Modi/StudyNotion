import express from "express";
const router = express.Router();
import contactUsController from "../controllers/ContactUs.controller.js";

router.post("/contact", contactUsController);

export default router;
