import express from "express";
import cors from "cors";
import { CreateAcount, LoginUser, ListScreen } from "./user.js";
import { CreateIn, CreateOut } from "./outputs.js";
const app = express();

app.use(cors());
app.use(express.json());

app.post('/register', CreateAcount);
app.post('/', LoginUser);
app.get('/listscreen', ListScreen);

app.post('/newinscreen', CreateIn);
app.post('/newoutscreen', CreateOut);

app.listen(5000), () => console.log("Listening on port 5000");