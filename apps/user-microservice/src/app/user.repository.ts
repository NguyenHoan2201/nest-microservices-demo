import { ConflictException, Injectable } from '@nestjs/common';
import { userDB } from '../assets/user.db';
import { User } from '@microservices-demo/shared/entities';

@Injectable()
export class UsersRepository {
    private readonly users: Map<number, User> = userDB;

    findOne(id: number) {
        return this.users.get(id);
    }

    findOneByEmail(email: string) {
        let foundUser: User = null;
        for (const [, user] of this.users) {
            if (user.email === email) {
                foundUser = user
            }
        };
        return foundUser
    }

    save(user: User) {
        
        const userExists = this.findOneByEmail(user.email);

        if (userExists) {
            throw new ConflictException(`User with email: ${user.email} already exists`)
        }
        
        const id = this.users.size + 1
        this.users.set(id, { ...user, id });
    }
}