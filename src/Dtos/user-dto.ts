import { IUser } from '../user/user.types'

export class UserDto {
    email;
    id;
    isActivated;
    name;

    constructor(model: {id:string, email:string, isActivated:boolean, name: string}) {
        this.email = model.email;
        this.id = model.id;
        this.isActivated = model.isActivated
        this.name = model.name
    }
}