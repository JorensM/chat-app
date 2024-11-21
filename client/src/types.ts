import { User } from '../../common/User'

export type Room = {
    users: User[],
    name: string,
    id: number
}