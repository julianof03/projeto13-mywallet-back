import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import joi from "joi";
import db from './db.js';
import { CreateAcount, LoginUser, ListScreen } from "./user.js";

const app = express();

app.use(cors());
app.use(express.json());


const inOutSchema = joi.object({
    valor: joi.number().min(1).required(),
    text: joi.string().min(1).required(),
});

app.post('/register', CreateAcount);

app.post('/', LoginUser);

app.get('/listscreen', ListScreen);

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


app.listen(5000), () => console.log("Listening on port 5000");