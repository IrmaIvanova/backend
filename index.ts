import express from 'express'
import { taskRouter } from './src/task/task.controller';
import { plannerRouter } from './src/planner/planner.controller'
import { userRouter } from './src/user/user.router'
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';

dotenv.config()

// const express = require("express");
var cors = require('cors')

const app = express();

app.use(cors())

const prisma = new PrismaClient()

const PORT = process.env.PORT;

async function main() {

    app.use(express.json())
    app.use(cookieParser())
    
    app.use('/api', userRouter)
    app.use('/api/task/planner', plannerRouter)
    app.use('/api/task', taskRouter)
  

    app.all("*", (req, res) => {

        res.status(404).json({ message: "NotFound" })
    })

    app.listen(PORT || 5000, () => console.log('SERVER STARTED ON PORT ' + PORT))
}

main()
    .then(async () => {
        await prisma.$connect()
    })
    .catch(async e => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })