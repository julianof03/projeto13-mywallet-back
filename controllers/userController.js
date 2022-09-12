import { db } from './dbController.js';
import joi from "joi";
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';

const registerSchema = joi.object({

    name: joi.string().min(1).required(),
    email: joi.string().min(1).required(),
    password: joi.string().min(1).required(),

});

const loginSchema = joi.object({

    email: joi.string().min(1).required(),
    password: joi.string().min(1).required(),

});

async function CreateAcount(req, res) {

    const { name, email, password } = req.body;
    
    const cripPassword = bcrypt.hashSync(password, 10);

    const validateRegister = registerSchema.validate(req.body);

    if (validateRegister.error) {
        res.sendStatus(422);
        return
    }

    const registreUser = await db.collection("participants").findOne({ email });
    if (registreUser) {
        res.status(409).send("Usuario ja existente");
        return
    }

    try {
        db.collection("participants").insertOne({
            name,
            email,
            password: cripPassword,
        }
        );

        res.sendStatus(201);

    } catch { res.sendStatus(500); }

};

async function LoginUser(req, res) {

    const { email, password } = req.body;

    const validateLogin = loginSchema.validate(req.body);

    if (validateLogin.error) {
        res.sendStatus(422);
        return
    }

    try {

        const loginUser = await db.collection("participants").findOne({ email });
        console.log(loginUser);
        if (!loginUser) {
            res.status(409).send("Usuario não cadastrado");
            return
        }

        if(email && bcrypt.compareSync(password, loginUser.password)){

            const token = uuid();

            db.collection("onlineUser").insertOne({
                token,
                name: loginUser.name,
                email
            });

            res.status(201).send({ password, name: loginUser.name, token});

        }else{
            res.sendStatus(401);
        }

    } catch { res.sendStatus(501); }
}

async function ListScreen(req, res) {

    const user = await res.locals.userOnline.name

    try {

        const outputs = await db.collection("InOut").find({ user }).toArray();
        const listarr = [{
            User: user,
            amount: "0",
            day: "",
            text: "",
            type: "status"
        }];
        if (outputs.length === 0) {
            res.send(listarr);
            return
        }

        res.send(outputs);

    } catch { res.sendStatus(501); }
};

export { CreateAcount, LoginUser, ListScreen };