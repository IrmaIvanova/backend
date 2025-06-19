import express from 'express'
import { taskRouter } from './src/task/task.controller';
import { plannerRouter } from './src/planner/planner.controller'
import { userRouter } from './src/user/user.router'
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
// import { errorMiddleWare } from './src/middlewares/error-middleware'
const errMiddleWare = require('./src/middlewares/error-middleware')

dotenv.config()

// const express = require("express");
var cors = require('cors')

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000', // локальный фронтенд
    // 'https://your-production-frontend.vercel.app' // продакшен фронтенд
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));
// app.use(cors({
//     credentials:true,
//     origin:process.env.CLIENT_URL
//     // origin:"https://irmaivanova.github.io/-task_scheduler/"
//     // origin:"https://irmaivanova.github.io/-task_scheduler/"
// }))

const prisma = new PrismaClient()

const PORT = process.env.PORT;

async function main() {

    app.use(express.json())
    app.use(cookieParser())

    app.use('/api', userRouter)
    app.use('/api/task/planner', plannerRouter)
    app.use('/api/task', taskRouter)
    app.use(errMiddleWare)

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