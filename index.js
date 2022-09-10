import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let db;
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect().then(() => { db = mongoClient.db("MyWalletdb"); });

const registerSchema = joi.object({
    name: joi.string().min(1).required(),
    email: joi.string().min(1).required(),
    password: joi.string().min(1).required(),
});
const loginSchema = joi.object({
    email: joi.string().min(1).required(),
    password: joi.string().min(1).required(),
});

app.post('/register', async (req, res) => {

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
        res.send(participantes);

    } catch { res.sendStatus(500); }

});

app.post('/', async (req, res)=>{
    const {email, password } = req.body;
    const validateLogin = loginSchema.validate(req.body);
    if (validateLogin.error) {
        res.sendStatus(422);
        return
    }
    
    const loginUser = await db.collection("participants").findOne({email});
    if(!loginUser){
         res.status(409).send("Usuario não cadastrado");
         return    
     }
    try {
        db.collection("lo").insertOne({
                email,
                password, 
                lastStatus: Date.now(),
            }
        );

        const participantes = await db.collection("participants").find({}).toArray();
        res.send(participantes);

    } catch { res.sendStatus(500); } 
})


app.listen(5000), () => console.log("Listening on port 5000");