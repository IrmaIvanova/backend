import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exeptions/api-errors'
import { TokenService } from '../user/token.service'

// Расширяем тип Request для добавления пользовательского поля
declare global {
  namespace Express {
    interface Request {
      user?: any; // Замените any на ваш тип пользователя
    }
  }
}
const tokenService = new TokenService()

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedUser());
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedUser());
    }

       const userData = tokenService.validationAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedUser());
    }

    req.user = userData; // Теперь TypeScript не будет ругаться
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedUser());
  }
};

// import { Request, Response, Router, NextFunction, } from 'express';
// import { ApiError } from '../exeptions/api-errors'
// import { TokenService } from '../user/token.service'
// import { UserDto } from '../Dtos/user-dto'

// const tokenService = new TokenService()

// // interface userReq extends Request {
// //     user: typeof UserDto
// // }
// // export const authMiddleWare =(err: Error, req: Request, res: Response, next: NextFunction)=>{
// module.exports.authMiddleWare = function (err: Error, req: Request, res: Response, next: NextFunction) {
//     try {

//         const authorizationHeader = req.headers.authorization;

//         if (!authorizationHeader) {
//             return next(ApiError.UnauthorizedUser())
//         }

//         const accsessToken = authorizationHeader.split(' ')[1]

//         if (!accsessToken) {
//             return next(ApiError.UnauthorizedUser())
//         }

//         const userData = tokenService.validationAccessToken(accsessToken);

//         if (!userData) {
//             return next(ApiError.UnauthorizedUser())
//         }

//         req.user  = userData;
//         next()
//     } catch {
//         return next(ApiError.UnauthorizedUser())
//     }
// }