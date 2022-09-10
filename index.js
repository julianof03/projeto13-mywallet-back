import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import dayjs from "dayjs";
import joi from "joi";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let db;
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect().then(() => { db = mongoClient.db("MyWalletdb"); });

let OnlineUser = 'undefined22';

const registerSchema = joi.object({
    name: joi.string().min(1).required(),
    email: joi.string().min(1).required(),
    password: joi.string().min(1).required(),
});
const loginSchema = joi.object({
    email: joi.string().min(1).required(),
    password: joi.string().min(1).required(),
});
const inOutSchema = joi.object({
    valor: joi.number().min(1).required(),
    text: joi.string().min(1).required(),
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
        res.send(201);

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
})

app.post('/newinscreen', async (req, res)=>{
    const {valor, text } = req.body;
    const validadeInOut = inOutSchema.validate(req.body);
    const User = OnlineUser;
    console.log(User);
    if (validadeInOut.error) {
        res.sendStatus(422);
        return
    }
    
    try {
        db.collection("InOut").insertOne({
                User,
                day: dayjs().format("DD/MM"),
                amount: valor,
                text: text,
                type: 'in',

            }
        );
        res.sendStatus(201);

    } catch { res.sendStatus(500); } 
})
app.post('/newoutscreen', async (req, res)=>{
    const {valor, text } = req.body;
    const validadeInOut = inOutSchema.validate(req.body);
    const User = OnlineUser;
    console.log(User);
    if (validadeInOut.error) {
        res.sendStatus(422);
        return
    }
    
    try {
        db.collection("InOut").insertOne({
                User,
                day: dayjs().format("DD:MM"),
                amount: valor,
                text: text,
                type: 'out',

            }
        );
        res.sendStatus(201);

    } catch { res.sendStatus(500); } 
})
app.get('/listscreen', async (req, res)=>{
    const User = OnlineUser;
    console.log(User);
    try {
        const outputs = await db.collection("InOut").find({User}).toArray();
        const listarr = outputs;
        res.send(listarr);
    } catch { res.sendStatus(500); } 
});


app.listen(5000), () => console.log("Listening on port 5000");