import { ITask } from '../task/task.types'

export interface IUser {
    id: string
    name: string
    hash: string
    email: string
    // isActivated: boolean
    // activationLink: string
    // tasks: ITask[]
}