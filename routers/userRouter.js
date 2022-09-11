import express  from "express";
import { CreateAcount, LoginUser, ListScreen} from "../controllers/userController.js";
const router = express.Router();

router.post('/register', CreateAcount);
router.post('/', LoginUser);
router.get('/listscreen', ListScreen);

export default router;