
import db from './db.js';
import joi from "joi";

const registerSchema = joi.object({
    name: joi.string().min(1).required(),
    email: joi.string().min(1).required(),
    password: joi.string().min(1).required(),
});
const loginSchema = joi.object({
    email: joi.string().min(1).required(),
    password: joi.string().min(1).required(),
});
let OnlineUser = 'undefined22';
async function CreateAcount(req, res) {

    const { name, email, password } = req.body;
    const validateRegister = registerSchema.validate(req.body);
    if (validateRegister.error) {
        res.sendStatus(422);
        return
    }
    console.log(name, email, password);
    
    const registreUser = await db.collection("participants").findOne({email});
    if(registreUser){
         res.status(409).send("Usuario ja existente");
         return    
     }
    try {
        db.collection("participants").insertOne({
                name,
                email,
                password, 
                lastStatus: Date.now(),
            }
        );
 
        const participantes = await db.collection("participants").find({}).toArray();
        res.send(201);

    } catch { res.sendStatus(500); }

};

async function LoginUser(req, res){
    const {email, password } = req.body;
    const validateLogin = loginSchema.validate(req.body);
    if (validateLogin.error) {
        res.sendStatus(422);
        return
    }
    
    const loginUser = await db.collection("participants").findOne({email});
    OnlineUser = loginUser.name;
    if(!loginUser){
         res.status(409).send("Usuario não cadastrado");
         return    
     }
    try {
        db.collection("participants").insertOne({
                email,
                password, 
                lastStatus: Date.now(),
            }
        );

        const participantes = await db.collection("participants").find({}).toArray();
        res.send(participantes);

    } catch { res.sendStatus(500); } 
}
async function ListScreen(req, res){
    const User = OnlineUser;
    console.log(User);
    try {
        const outputs = await db.collection("InOut").find({User}).toArray();
        const listarr = [{
            User: User,
            amount: "0",
            day: "",
            text: "",
            type: "status"
        }];
        if(outputs.length === 0){
            res.send(listarr);
            return
        }
        res.send(outputs);
    } catch { res.sendStatus(500); } 
};

export {CreateAcount, LoginUser, ListScreen} ;