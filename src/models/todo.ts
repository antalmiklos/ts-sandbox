import { time } from 'console';
import * as fs from 'fs';
import { todo } from 'node:test';

type todosFile = {
    todos: todo[]
}

export type todo = {
    id: number,
    name: string,
    summary?: string
    createdAt: string
    done: boolean
}

export const readTodosFromFile = (fname: string = "todos.json"): todo[] => {
    const raw = fs.readFileSync(fname)
    const content = JSON.parse(raw.toString()) as todosFile
    return content.todos
}

const sortTodos = (items: todo[]): todo[] => {
    return items.sort((a:todo,b:todo) => {
        if (a.id > b.id) {
            return 1
        }
        return -1
    })
}

const saveTodosToFile = (items: todo[], fname: string = "todos.json"): void => {
    items = sortTodos(items)
    console.log(items)
    fs.writeFile(fname, JSON.stringify({ todos: items }), (err) => {
        if (err !== null) {
            console.log(err)
            throw err
        }
    })
}

export const filterTodos = <Key extends keyof todo>(items: todo[], key: Key, value: string | number | boolean, strict: boolean = false): todo[] => {
    return items.filter((i) => {
        if (!strict) {
            if (typeof i[key] == "string") {
                const o = String(i[key])
                return o.includes(String(value))
            }
        }
        return i[key] === value as typeof i[Key]
    })
}

const insertTodos = (...items: todo[]): todo[] | void => {
    try {
        let todoArr = readTodosFromFile()
        todoArr.push(...items)
        return todoArr
    } catch (error) {
        console.log((error as Error).message)
    }
}

export const updateTodo = (item: todo) => {
    if (item.id == 0) {
        throw new Error("can not update without id");
    }

    let todoArr = readTodosFromFile()
    //  const i = todoArr.indexOf({ id: item.id } as todo)

    const i = todoArr.map((c)=>{
        return c.id
    }).indexOf(item.id)

    if (i == -1) {
        throw new Error(`todo not found: ${item.id}`);
        
    }
    const original = todoArr[i]

    todoArr[i] = { 
        id: item.id, 
        name: item.name, 
        summary: item.summary, 
        done: item.done || original.done,
        createdAt: original.createdAt || Date.now().toString()
    } as todo

    saveTodosToFile(todoArr)
}

/* returns id of new todo */
export const newTodo = (item: todo): number => {
    const id = readTodosFromFile().length + 1
    try {
        const updatedArr = insertTodos({
            id: id,
            name: item.name,
            summary: item.summary || "",
            createdAt: Date.now().toString(),
            done: item.done
        })
        saveTodosToFile(updatedArr!)
        return id
    } catch (error) {
        console.log((error as Error).message)
        throw error
    }
}