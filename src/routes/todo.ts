import express from "express";
import { createTodo, editTodo, getTodos, getTodoById, searchTodo } from "../controllers/todo";
import { getTodo, updateTodo } from "../models/todo";

const todoRouter = express.Router()
todoRouter.get("/", getTodos)
todoRouter.get("/:id", getTodoById)
todoRouter.put("/:id", updateTodo)
todoRouter.get("/:key/:value", searchTodo)
todoRouter.post("/", createTodo)

export default todoRouter