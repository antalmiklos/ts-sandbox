import { filterTodos, newTodo, readTodosFromFile, todo, updateTodo } from "../models/todo"
import { Request, Response } from "express"

export const createTodo = (req: Request, res: Response) => {
    const payload = req.body as todo
    try {
        res.json(newTodo(payload))
    } catch (error) {
        res.send((error as Error).message)
    }
}

export const getTodos = (req: Request, res: Response) => {
    try {
        res.json(readTodosFromFile())
    } catch (error) {
        res.send((error as Error).message)
    }
}

export const getTodoById = (req: Request, res: Response) => {
    try {
        const id = Number(req.params["id"])
        const item = filterTodos(readTodosFromFile(), "id", id)[0]
        if(!item) {
            res.sendStatus(404)
            return
        }
        res.json(item)
    } catch (error) {
        res.send((error as Error).message)
    }
}

export const editTodo = (req: Request, res: Response) => {
    try {
        const id = Number(req.params["id"])
        const payload = req.body as todo
        const item = filterTodos(readTodosFromFile(), "id", id)[0]
        if(!item) {
            res.sendStatus(404)
            return
        }
        updateTodo({...payload, id: id})
        res.json(filterTodos(readTodosFromFile(), "id", id)[0])
    } catch (error) {
        res.send((error as Error).message)
    }
}

export const searchTodo = <Key extends keyof todo>(req: Request, res: Response) => {
    try {
        const searchKey = req.params["key"] as Key
        const searchVal = req.params["value"]
        const items = filterTodos(readTodosFromFile(), searchKey, searchVal)
        if(items.length == 0) {
            res.sendStatus(404)
            return
        }
        res.json(items)
    } catch (error) {
        res.send((error as Error).message)
    }
}

export default {
    searchTodo,
    editTodo,
    getTodoById,
    getTodos,
    createTodo
}