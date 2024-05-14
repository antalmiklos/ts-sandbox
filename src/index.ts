import express, { Request, Response } from "express";
import todoRouter from "./routes/todo";

const app = express()

app.use(express.json());
/* 
app.use("/", (req: Request, res: Response) => {
    res.send("hello world")
}) */

app.use("/todo/", todoRouter)

app.listen(3000, () => {
    console.log("ok")
})