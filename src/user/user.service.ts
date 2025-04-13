import { IUser } from './user.types'
import { PrismaClient, User } from '@prisma/client';
import { Request, Response, Router, NextFunction } from 'express';
import { MailService } from './mail.service'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { TokenService } from './token.service'
import { UserDto } from '../Dtos/user-dto'
import dotenv from "dotenv";
import { ApiError } from '../exeptions/api-errors'

dotenv.config()

const mailService = new MailService()

const tokenService = new TokenService()


export class UserService {
    private userClient = new PrismaClient().user

    async returnUserAccsess(user: any) {
        const userDto = new UserDto(user)


        const tokens = tokenService.generateToken({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto,
        }
    }

    async registration(email: string, password: string, name: string) {
        let candidate = await this.userClient.findUnique({
            where: { email },
        })

        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с таким адресом ${email} уже существует `)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuidv4()


        const userProfile = await this.userClient.create({
            data: {
                email, hash: hashPassword, name, id: activationLink, activationLink, isActivated: false
            }
        })



        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        return await this.returnUserAccsess(userProfile)
        // const userDto = new UserDto(userProfile)


        // const tokens = tokenService.generateToken({ ...userDto })

        // await tokenService.saveToken(userDto.id, tokens.refreshToken)

        // return {
        //     ...tokens,
        //     user: userDto,
        // }
    }

    async activate(activationLink: string) {
        const user = await this.userClient.findUnique({
            where: { id: activationLink },
        })
        if (!user) {
            throw ApiError.BadRequest(`Некорректная ссылка активации `)
        }

        user.isActivated = true;

        await this.userClient.update({
            where: { id: activationLink },
            data: user

        })

    }

    async login(email: string, password: string) {
        let user = await this.userClient.findUnique({
            where: { email },
        })

        if (!user) {
            throw ApiError.BadRequest(`Пользователь с адресом ${email} не найден`)
        }

        const isPassEqual = bcrypt.compare(password, user?.hash)
        if (!isPassEqual) {
            throw ApiError.BadRequest(`Некорректный пароль`)
        }

        return await this.returnUserAccsess(user)
    }

    async logout(refreshToken: string) {
        const token = tokenService.removeToken(refreshToken)
        return token;
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedUser()
        }
        const userData = tokenService.validationRefreshToken(refreshToken);
        const tokenFromDB = tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedUser()
        }

        const user = await this.userClient.findUnique({
            where: { id: userData.email },
        })

        return await this.returnUserAccsess(user)
    }

    async getUsers() {
        const users = await this.userClient.findMany()
        return users
    }

}