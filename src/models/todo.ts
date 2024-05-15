import { Prisma, PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { todo } from 'node:test';

export type todo = {
    id: number,
    title: string,
    description: string | null
    isDone: boolean
    createdAt: Date | string | undefined
    updatedAt: Date | string | undefined
}

const sortTodos = (items: todo[]): todo[] => {
    return items.sort((a: todo, b: todo) => {
        if (a.id > b.id) {
            return 1
        }
        return -1
    })
}

export const getAllTodos = async (): Promise<todo[]> => {
    const db = new PrismaClient()
    return db.todos.findMany()
}

export const searchTodos = async (query: object): Promise<todo[]> => {
    const db = new PrismaClient()
    return db.todos.findMany({
        where: query,
        orderBy: {
            id: "asc"
        }
    })
}

export const getTodo = async (id: number): Promise<todo> => {
    const db = new PrismaClient()
    return db.todos.findFirstOrThrow({
        where: {id: id},
    })
}

export const updateTodo = (item: todo) => {
    if (item.id == 0) {
        throw new Error("can not update without id");
    }
    const db = new PrismaClient()
    return db.todos.update({
        data: {...item, updatedAt: new Date(), id: item.id},
        where: {
            id: item.id
        }
    })

/*     let todoArr = readTodosFromFile()
    //  const i = todoArr.indexOf({ id: item.id } as todo)

    const i = todoArr.map((c) => {
        return c.id
    }).indexOf(item.id)

    if (i == -1) {
        throw new Error(`todo not found: ${item.id}`);

    }
    const original = todoArr[i]

    todoArr[i] = {
        id: item.id,
        name: item.name,
        description: item.description,
        isDone: item.isDone || original.isDone,
        createdAt: original.createdAt || Date.now().toString(),
        updatedAt: Date.now().toString()
    } as todo

    saveTodosToFile(todoArr) */
}

const validatePayload = (pl: Prisma.todosCreateInput) => {
    if(!pl.title) {
        throw new Error("title missing");
    }
}

const cleanPayload = (pl: Prisma.todosCreateInput): Prisma.todosCreateInput =>  {
    const cleanedPayload = {
        title: pl.title ?? "",
        description: pl.description,
        isDone: pl.isDone ?? false
    } as Prisma.todosCreateInput
    return cleanedPayload
}

export const newTodo = async (item: Prisma.todosCreateInput): Promise<todo> => {
    const db = new PrismaClient()
    validatePayload(item)
    item = cleanPayload(item)
    return db.todos.create({
        data: {...item, createdAt: new Date(), updatedAt: new Date()}
    })
}