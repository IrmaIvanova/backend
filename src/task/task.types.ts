export interface ITask {
    id: string
    title: string
    checked: boolean
    date: string
    // planner: {
    //     id: string
    //     date: string
    //     todo:ITask[]
    // }
    plannerId: string
}

// export interface User {
//     id: string
//     email: string
//     name: string
//     tasks: ITask[]
// }\\ "author": {
//     "name": "mira",
//     "id": "sxjasjasjsaj",
//     "email": "nowa@miryande.ru",
//     "tasks": []
// },
// "autorId": "sxjasjasjsaj"