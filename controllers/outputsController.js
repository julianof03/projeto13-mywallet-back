import {db} from './dbController.js';
import joi from "joi";
import dayjs from "dayjs";

const inOutSchema = joi.object({
    valor: joi.number().min(1).required(),
    text: joi.string().min(1).required(),
});


async function CreateIn (req, res){
    const user = await res.locals.userOnline.name
    console.log(user);
    const {valor, text } = req.body;
    const validadeInOut = inOutSchema.validate(req.body);
    if (validadeInOut.error) {
        res.sendStatus(422);
        return
    }
    
    try {
        db.collection("InOut").insertOne({
                user,
                day: dayjs().format("DD/MM"),
                amount: valor,
                text: text,
                type: 'in',

            }
        );
        res.sendStatus(201);

    } catch { res.sendStatus(500); } 
};
async function CreateOut(req, res){
    const user = await res.locals.userOnline.name
    console.log(user);
    const {valor, text } = req.body;
    const validadeInOut = inOutSchema.validate(req.body);
    if (validadeInOut.error) {
        res.sendStatus(422);
        return
    }
    
    try {
        db.collection("InOut").insertOne({
                user,
                day: dayjs().format("DD/MM"),
                amount: valor,
                text: text,
                type: 'out',

            }
        );
        res.sendStatus(201);

    } catch { res.sendStatus(500); } 
};

export {CreateIn, CreateOut}
