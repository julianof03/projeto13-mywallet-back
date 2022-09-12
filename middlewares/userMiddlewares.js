import {db} from '../controllers/dbController.js';

async function ValidUser(req, res, next){
    const {email} = req.body;
    console.log(email);
    res.locals.email = email;
     try{
     const loginUser =  await db.collection("participants").findOne({email});
     res.locals.user = loginUser.name;
     console.log(res.locals.user);
     next();
     }catch{
         console.log("deu ruim");
         return res.sendStatus(500);
     }
}

export default ValidUser;