import { User } from '@microservices-demo/shared/entities';

export const userDB: Map<number, User> = new Map<number, User>();

userDB.set(1, { id: 1, email: 'labeight@scpulse.com', password: 'password123', firstName: 'John', lastName: 'Doe' })
userDB.set(2, { id: 2, email: 'labseven@scpulse.com', password: 'password123', firstName: 'Jane', lastName: 'Doe' })
userDB.set(3, { id: 3, email: 'labsix@scpulse.com', password: 'password123', firstName: 'Thomas', lastName: 'Doe' })