import { IUser } from './user.types'
import { PrismaClient, User } from '@prisma/client';
import { Request, Response, Router, NextFunction } from 'express';
import { UserService } from './user.service'
import dotenv from "dotenv";
import { validationResult } from 'express-validator'
import { ApiError } from '../exeptions/api-errors'

dotenv.config()



const userService = new UserService()

export class UserController {

    // async registration(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const errors = validationResult(req);
    //         if (!errors.isEmpty()) {
    //             const errorMessages = errors.array().map(err => err.msg);
    //             return next(ApiError.BadRequest("Ошибка при валидации", errorMessages))
    //         }
    //         const { email, password, name } = req.body;
    //         const userData = await userService.registration(email, password, name)

    //         res.cookie("refreshToken", userData?.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

    //         return res.json(userData)
    //     } catch (e) {
    //         next(e)
    //     }
    // }
    async registration(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(err => err.msg);
                next(ApiError.BadRequest("Ошибка при валидации", errorMessages));
                return; // Явный return без значения
            }

            const { email, password, name } = req.body;
            const userData = await userService.registration(email, password, name);

            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            res.header('Access-Control-Allow-Origin', 'https://irmaivanova.github.io')
                .header('Access-Control-Allow-Credentials', 'true')
                .cookie('refreshToken', userData.refreshToken, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                })
                .status(201)
                .json(userData);
        } catch (e) {
            next(e);
        }
    }
    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)

            return res.redirect(process?.env?.CLIENT_URL || "https://irmaivanova.github.io")
        } catch (e) {
            next(e)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password)

            res.cookie("refreshToken", userData?.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken)

            res.clearCookie("refreshToken")

            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken)

            res.cookie("refreshToken", userData?.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getUsers();
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

}