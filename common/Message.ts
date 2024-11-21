import { User } from './User'

export type Message = {
    user: User,
    text: string,
    timestamp: number
}