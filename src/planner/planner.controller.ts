import { Request, Response, Router } from 'express';





import { PlannerService } from './planner.service';

const router = Router();

const plannerService = new PlannerService()

router.post('/', async (req: Request, res: Response) => {

    const planner = await plannerService.createPlanner(req.body)
  
    res.status(200).json(planner)
})

router.get('/:userId', async (req: Request, res: Response) => {
    const userId = req.params.id
    const planner = await plannerService.getPlanner(userId)

    res.status(200).json(planner)
})

router.get('/:id', async (req: Request, res: Response) => {
    const plannerId = req.params.id
    const planner = await plannerService.getPlannerById(plannerId)
    res.json(planner)
})

export const plannerRouter = router;
