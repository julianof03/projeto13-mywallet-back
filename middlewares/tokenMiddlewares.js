
import {db} from '../controllers/dbController.js';

async function MidToken(req, res, next) {
    const { autorization } = req.headers;
    const token = autorization?.replace("Bearer ", "");
    const userOnline = await db.collection("onlineUser").findOne({token});
    if (userOnline === null){
        return res.status(401).send("User não encontrado");
    }

    res.locals.userOnline = userOnline;

    next();
}

export default MidToken;