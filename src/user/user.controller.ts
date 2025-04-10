import { IUser } from './user.types'
import { PrismaClient, User } from '@prisma/client';
import { Request, Response, Router, NextFunction } from 'express';
import { UserService } from './user.service'

const userService = new UserService()

export class UserController {
    // private userClient = new PrismaClient().user

    // async createUser(req: Request, res: Response, next: NextFunction) {
    //     try{
    //         const { email, password, name, id } = req.body;
    //         const userData = await userService.createUser({email, hash:password, name, id});
    //         return res.json(userData)

    //     }catch(e){

    //     }
       
    // }

    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, name } = req.body;
            const userData = await userService.registration(email, password, name)

            res.cookie("refreshToken", userData?.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (e) {
            console.log(e)
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