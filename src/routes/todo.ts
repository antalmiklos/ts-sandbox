import express from "express";
import { createTodo, editTodo, getTodos, getTodoById, searchTodo } from "../controllers/todo";
import { updateTodo } from "../models/todo";

let todoRouter = express.Router()
todoRouter.get("/", getTodos)
todoRouter.get("/:id", getTodoById)
todoRouter.post("/:id", editTodo)
todoRouter.get("/:key/:value", searchTodo)
todoRouter.put("/", createTodo)

export default todoRouter