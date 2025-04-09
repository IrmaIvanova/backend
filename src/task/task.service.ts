import { ITask } from './task.types'
import { PrismaClient, Task } from '@prisma/client';


export class TaskService {
    private taskClient = new PrismaClient().task

    createTask(task: ITask): Promise<Task> {
        console.log("task222", task)
        return this.taskClient.create({
            data: task
        });
    }

    async getTasks(): Promise<Task[]> {
        return this.taskClient.findMany()
    }

    async getTaskById(id: any): Promise<Task | null> {
        let task = this.taskClient.findUnique({
            where: { id }
        })
        return task
    }
    async changeTask(id: any, task: ITask): Promise<Task | null> {
        return this.taskClient.update({
            where: { id },
            data: task
        })
        
    }
    async deleteTask(id: any): Promise<Task | null> {
        return this.taskClient.delete({
            where: { id }
        })
        
    }
}