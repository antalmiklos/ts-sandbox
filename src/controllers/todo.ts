import { Prisma } from "@prisma/client"
import { getAllTodos, getTodo, newTodo, searchTodos, todo, updateTodo } from "../models/todo"
import { Request, Response } from "express"

export const createTodo = async (req: Request, res: Response) => {
    const payload = req.body as todo
    try {
        res.json(await newTodo(payload))
    } catch (error) {
        res.status(400).send((error as Error).message)
    }
}

export const getTodos = async (req: Request, res: Response) => {
    try {
        res.json(await getAllTodos())
    } catch (error) {
        res.send((error as Error).message)
    }
}

export const getTodoById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params["id"])
        res.json(await getTodo(id))
    } catch (error) {
        res.send((error as Error).message)
    }
}

export const editTodo = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params["id"])
        const payload = req.body as todo
        payload.id = id
        await updateTodo(payload)
        res.sendStatus(200)
    } catch (error) {
        res.status(400).send((error as Error).message)
    }
}

export const searchTodo = async (req: Request, res: Response) => {
    try {
        const searchKey = req.params["key"]
        const searchVal = req.params["value"]
        const strict = Boolean(req.params.strict) ?? false
        const items = await searchTodos(buildSearchQuery(searchKey as keyof todo, searchVal))
        res.json(items)
    } catch (error) {
        res.status(400).send((error as Error).message)
    }
}

const buildSearchQuery = (k: Prisma.TodosScalarFieldEnum, v: string, strict = false) => {
/*     if (!isValidFilterKey(k)) {
        throw new Error("invalid key")
    } */
    if(!Object.keys(Prisma.TodosScalarFieldEnum).includes(k)) {
        throw new Error(`invalid key: ${k}`);
    }

    if (k == "isDone") {
        v = JSON.parse(v.toLowerCase())
        return {[`${k}`]: v}
    } 

    if (typeof v == "string") {
        if(!strict) {
            console.log({[`${k}`]: {contains: v}})
            return {[`${k}`]: {contains: v}}
        }
        return {[`${k}`]: v}
    }
    return {[`${k}`]: Number(v)}
}