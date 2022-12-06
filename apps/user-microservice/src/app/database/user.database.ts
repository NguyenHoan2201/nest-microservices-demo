import { User } from '@microservices-demo/shared/entities';

export const userDatabase: Map<number, User> = new Map<number, User>();

userDatabase.set(1, { id: 1, email: 'labeight@scpulse.com', password: 'password123', firstName: 'John', lastName: 'Doe' })
userDatabase.set(2, { id: 2, email: 'labseven@scpulse.com', password: 'password123', firstName: 'Jane', lastName: 'Doe' })
userDatabase.set(3, { id: 3, email: 'labsix@scpulse.com', password: 'password123', firstName: 'Thomas', lastName: 'Doe' })