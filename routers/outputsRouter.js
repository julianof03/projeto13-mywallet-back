import express  from "express";
import { CreateIn, CreateOut } from "../controllers/outputsController.js";
import UserMiddleware from '../middlewares/userMiddlewares.js';
import MidToken from "../middlewares/tokenMiddlewares.js";
const router = express.Router();

router.use(MidToken);
router.post('/newinscreen', CreateIn);
router.post('/newoutscreen', CreateOut);

export default router;