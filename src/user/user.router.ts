import { Request, Response, Router } from 'express';
import { body } from 'express-validator'
import { UserController } from './user.controller';
// import { authMiddleWare } from '../middlewares/auth-middleware'

const authMiddleWare = require('../middlewares/auth-middleware')
const router = Router();

const userController = new UserController()

router.post('/registration',
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 32 }),
    userController.registration)
router.post('/login',
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 32 }), 
    userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleWare.authMiddleWare, userController.getUsers)

export const userRouter = router;