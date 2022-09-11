import express  from "express";
import {CreateIn, CreateOut}  from "../controllers/outputsController.js";

const router = express.Router();

router.post('/newinscreen', CreateIn);
router.post('/newoutscreen', CreateOut);

export default router;