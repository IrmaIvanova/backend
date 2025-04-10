import { IUser } from './user.types'
import { PrismaClient, User } from '@prisma/client';
import { Request, Response, Router, NextFunction } from 'express';
import { MailService } from './mail.service'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { TokenService } from './token.service'
import { UserDto } from '../Dtos/user-dto'
import dotenv from "dotenv";


dotenv.config()

const mailService = new MailService()

const tokenService = new TokenService()





export class UserService {
    private userClient = new PrismaClient().user

    async registration(email: string, password: string, name: string) {
        let candidate = await this.userClient.findUnique({
            where: { email },
        })

        if (candidate) {
            throw new Error(`Пользователь с таким адресом ${email} уже существует `)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuidv4()


        const userProfile = await this.userClient.create({
            data: {
                email, hash: hashPassword, name, id: activationLink, activationLink, isActivated: false
            }
        })



        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        const userDto = new UserDto(userProfile)


        const tokens = tokenService.generateToken({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto,
        }
    }
    async activate(activationLink: string) {
        const user = await this.userClient.findUnique({
            where: { id: activationLink },
        })
        if (!user) {
            throw new Error(`Некорректная ссылка активации `)
        }

        user.isActivated = true;

        await this.userClient.update({
            where: { id: activationLink },
            data: user

        })

    }
    async login(req: Request, res: Response, next: NextFunction) {
        try {

        } catch {

        }
    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {

        } catch {

        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {

        } catch {

        }
    }
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(["123", "456"])
        } catch {

        }
    }


    // async createUser(user: IUser): Promise<User> {
    //     return this.userClient.create({
    //         data: user
    //     });
    // }

    // async getUser():Promise<User[]>{
    //     return this.userClient.findMany({
    //         include: { planner: true },
    //       })
    // }
    // async getUserById(id: any): Promise<User | null> {
    //       let task = this.userClient.findUnique({
    //           where: { id },
    //           include: { planner: true },
    //       })
    //       return task
    //   }

}