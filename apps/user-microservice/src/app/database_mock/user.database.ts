export class UserMock {
    id?: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const userDatabase: Map<number, UserMock> = new Map<number, UserMock>();

userDatabase.set(1, { id: 1, email: 'labeight@scpulse.com', password: 'password123', firstName: 'John', lastName: 'Doe' })
userDatabase.set(2, { id: 2, email: 'labseven@scpulse.com', password: 'password123', firstName: 'Jane', lastName: 'Doe' })
userDatabase.set(3, { id: 3, email: 'labsix@scpulse.com', password: 'password123', firstName: 'Thomas', lastName: 'Doe' })