import { Request, Response, Router, NextFunction } from 'express';
import { body } from 'express-validator'
import { UserController } from './user.controller';

// import { authMiddleWare } from '../middlewares/auth-middleware'

const authMiddleWare = require('../middlewares/auth-middleware')
const router = Router();

const userController = new UserController()

router.post('/registration',
    [
        body('email').isEmail().withMessage('Некорректный email'),
        body('password').isLength({ min: 3, max: 32 }).withMessage('Пароль должен быть от 3 до 32 символов')
    ],
    (req: Request, res: Response, next: NextFunction) => {
        userController.registration(req, res, next);
    })
router.post('/login',
    [body("email").isEmail(),
    body("password").isLength({ min: 3, max: 32 })
    ],
    (req: Request, res: Response, next: NextFunction) => {
        userController.login(req, res, next)
    })
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    userController.logout(req, res, next)
})
router.get('/activate/:link', userController.activate)
router.get('/refresh', (req: Request, res: Response, next: NextFunction) => {
    userController.refresh(req, res, next)
})
router.get('/users', authMiddleWare.authMiddleWare, (req: Request, res: Response, next: NextFunction) => {
    userController.getUsers(req, res, next)
})

export const userRouter = router;