import { Request, Response, Router } from 'express';
import { TaskService } from './task.service';

const router = Router();

const taskService = new TaskService()

router.get('/', async (req: Request, res: Response) => {

    const task = await taskService.getTasks()
    res.json(task)
})

router.post('/', async (req: Request, res: Response) => {

    if (!req?.body?.title?.length) {
        return res.status(400).json({ message: "Title is required" })
    }

    const task = await taskService.createTask(req.body)

    res.status(200).json(task)
})

router.get('/:id', async (req: Request, res: Response) => {
    const taskId = req.params.id
    const task = await taskService.getTaskById(taskId)
    res.json(task)
})

router.put('/:id', async (req: Request, res: Response) => {
    const taskId = req.params.id;
    const taskData = req.body
    const task = await taskService.changeTask(taskId, taskData)
    res.json(task)
})

router.delete('/:id', async (req: Request, res: Response) => {
    const taskId = req.params.id
    const task = await taskService.deleteTask(taskId)
    res.json(task)
})


export const taskRouter = router;
