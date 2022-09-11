import express from "express";
import cors from "cors";
import userRouter from './routers/userRouter.js'
import outputRouter from './routers/outputsRouter.js'
const app = express();

app.use(cors());
app.use(express.json());

app.use(userRouter);

app.use(outputRouter);

app.listen(5000), () => console.log("Listening on port 5000"); 