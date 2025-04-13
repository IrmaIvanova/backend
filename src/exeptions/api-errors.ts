export class ApiError extends Error {
    status;
    errors;

    constructor(status: number, message: string, errors: number[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedUser() {
        return new ApiError(401, "Пользователь не авторизован")
    }

    static BadRequest( message: string, errors: number[] = []) {
        return new ApiError(400,  message, errors)
    }
}