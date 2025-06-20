import { Request, Response, Router, NextFunction, } from 'express';
import { ApiError } from '../exeptions/api-errors'

// export const errorMiddleWare = (err: Error, req: Request, res: Response, next: NextFunction) => {

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors
        });
    }
    console.error('Unhandled error:', err); // Логирование для отладки
    return res.status(500).json({ message: 'Непредвиденная ошибка' });
};
