import express from 'express';
import { taskRouter } from './src/task/task.controller';
import { plannerRouter } from './src/planner/planner.controller';
import { userRouter } from './src/user/user.router';
import { healthCheck } from './src/healthCheck.router';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './src/middlewares/error-middleware';
import cors from 'cors';
import dotenv from 'dotenv';

// Инициализация окружения
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// CORS настройки
// const corsOptions = {
//   origin: [
//     'https://irmaivanova.github.io',
//     'http://localhost:3000'
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };
const allowedOrigins = [
  'https://irmaivanova.github.io',
  'http://localhost:3000'
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Для preflight запросов
app.use(express.json());
app.use(cookieParser());

// Роуты
app.use('/api', userRouter);
app.use('/api/healthcheck', healthCheck);
app.use('/api/task/planner', plannerRouter);
app.use('/api/task', taskRouter);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  next();
});
// Обработка 404
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Обработка ошибок
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => { errorMiddleware });

// Запуск сервера
async function main() {
  await prisma.$connect();
  
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// import express from 'express'
// import { taskRouter } from './src/task/task.controller';
// import { plannerRouter } from './src/planner/planner.controller'
// import { userRouter } from './src/user/user.router'
// import { healthCheck } from './src/healthCheck.router'
// import dotenv from "dotenv";
// import { PrismaClient } from '@prisma/client';
// import cookieParser from 'cookie-parser';
// import { errorMiddleware } from './src/middlewares/error-middleware'
// import cors from 'cors';


// const app = express();
// const prisma = new PrismaClient();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// const corsOptions = {
//   origin: [
//     'https://irmaivanova.github.io',
//     'http://localhost:3000' // для разработки
//   ],
//   credentials: true,
//   optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));

// // ... ваши роуты здесь ...
// app.use(express.json())
// app.use(cookieParser())

// app.use('/api', userRouter)
// app.use('/api/healthcheck', healthCheck)
// app.use('/api/task/planner', plannerRouter)
// app.use('/api/task', taskRouter)

// app.options('*', cors(corsOptions));
// app.all("*", (req, res) => {

//     res.status(404).json({ message: "NotFound" })
// })

// app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => { errorMiddleware });

// async function main() {
//     await prisma.$connect();

//     app.listen(PORT, () => {
//         console.log(`Server started on port ${PORT}`);
//     });
// }

// main()
//     .then(async () => {
//         await prisma.$disconnect();
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });

// // dotenv.config()

// // // const express = require("express");
// // var cors = require('cors')

// // const app = express();

// // app.use(cors({
// //     credentials: true,
// //     origin: process.env.CLIENT_URL
// //     // origin:"https://irmaivanova.github.io/-task_scheduler/"
// //     // origin:"https://irmaivanova.github.io/-task_scheduler/"
// // }))

// // const prisma = new PrismaClient()

// // const PORT = process.env.PORT;

// // async function main() {

// //     app.use(express.json())
// //     app.use(cookieParser())

// //     app.use('/api', userRouter)
// //     app.use('/api/healthcheck', healthCheck)
// //     app.use('/api/task/planner', plannerRouter)
// //     app.use('/api/task', taskRouter)


// //     app.all("*", (req, res) => {

// //         res.status(404).json({ message: "NotFound" })
// //     })
// //     app.use(errorMiddleware)
// //     app.listen(PORT || 5000, () => console.log('SERVER STARTED ON PORT ' + PORT))
// // }

// // main()
// //     .then(async () => {
// //         await prisma.$connect()
// //     })
// //     .catch(async e => {
// //         console.error(e)
// //         await prisma.$disconnect()
// //         process.exit(1)
// //     })