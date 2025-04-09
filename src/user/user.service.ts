import { IUser } from './user.types'
import { PrismaClient, User } from '@prisma/client';
import { Request, Response, Router, NextFunction } from 'express';
import { MailService } from './mail.service'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { TokenService } from './token.service'
import { UserDto } from '../Dtos/user-dto'
const sendActivationMail = new MailService().sendActivationMail

const tokenService = new TokenService()





export class UserService {
    private userClient = new PrismaClient().user

    // async registration(email:string, password:string) {
    //    const candidate = await this.userClient.findUnique({email})
    // async createUser(user: IUser): Promise<User> {
    //     console.log("user", user)
    //     const userData = this.userClient.create({
    //         data: user
    //     })
    //     return userData
    // }

    async registration(email: string, password: string, name: string) {
    // async registration(email: string, password: string, name: string): Promise<{ accsessToken: string, refreshToken: string, user: typeof UserDto } | null> {
        let candidate = this.userClient.findUnique({
            where: { email },
        })

        if (!candidate) {
            throw new Error(`Пользователь с таким адресом ${email} уже существует `)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuidv4()


        const userProfile = this.userClient.create({
            data: {
                email, hash: hashPassword, name, id: activationLink, activationLink, isActivated: false
            }
        })
        // const userProfile = this.createUser({ email, hash: hashPassword, name, id: activationLink, activationLink, isActivated: false })
        // const userProfile =th { email, hash: hashPassword, name, id: activationLink, activationLink, isActivated: false };


        await sendActivationMail(email, activationLink)

        const userDto = new UserDto({ email, name, id: activationLink,  isActivated:false})

        console.log("userDto", userDto)

        const tokens = tokenService.generateToken({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto,


        }
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
    async activate(req: Request, res: Response, next: NextFunction) {
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