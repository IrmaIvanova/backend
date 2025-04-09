import { IPlanner } from './planner.types'
import { PrismaClient, Planner } from '@prisma/client';


export class PlannerService {
    private plannerClient = new PrismaClient().planner
   
    async createPlanner(planner: IPlanner): Promise<Planner> {
        return this.plannerClient.create({
            data: planner
        });
    }

    async getPlanner(id: any):Promise<Planner[]>{
        return this.plannerClient.findMany({
            where: { id },
            include: { tasks: true },
          })
    }
    async getPlannerById(id: any): Promise<Planner | null> {
          let task = this.plannerClient.findUnique({
              where: { id },
              include: { tasks: true },
          })
          return task
      }

}