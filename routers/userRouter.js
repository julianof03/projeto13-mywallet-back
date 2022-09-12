import express  from "express";
import { CreateAcount, LoginUser, ListScreen} from "../controllers/userController.js";
import MidToken from "../middlewares/tokenMiddlewares.js";
const router = express.Router();



router.post('/register', CreateAcount);
router.post('/', LoginUser);
router.use(MidToken);
router.get('/listscreen', ListScreen);

export default router;