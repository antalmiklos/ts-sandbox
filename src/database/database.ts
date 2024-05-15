import { PrismaClient } from "@prisma/client";

const client = new PrismaClient()

export default function getDatabase(): PrismaClient {
    return client
}