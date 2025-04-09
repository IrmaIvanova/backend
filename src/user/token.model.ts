import { IUser } from './user.types'

export interface TokenSchema {
    user: IUser,
    refreshToken: string

}