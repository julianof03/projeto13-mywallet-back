import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import joi from "joi";

const app = express();

app.use(cors());
app.use(express.json());


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
});


app.listen(5000), () => console.log("Listening on port 5000");