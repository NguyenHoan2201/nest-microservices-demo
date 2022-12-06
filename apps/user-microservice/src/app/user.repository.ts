import { Injectable } from '@nestjs/common';
import { userDB } from '../assets/user.db';
import { User } from '@microservices-demo/shared/entities';

@Injectable()
export class UsersRepository {
    private readonly users: Map<number, User> = userDB;

    save(user: User) {
        const id = this.users.size + 1
        this.users.set(id, { ...user, id });
    }

    findOne(id: number) {
        return this.users.get(id);
    }

    findOneBy(inputObj: Partial<User>) {
        let foundUser: User = null;

        for (const [, user] of this.users) {
            switch (true) {
                case !!inputObj.id:
                    if (user.id === inputObj.id) foundUser = user;
                    break;
                case !!inputObj.email:
                    if (user.email === inputObj.email) foundUser = user;
                    break;
                case !!inputObj.firstName:
                    if (user.firstName === inputObj.firstName) foundUser = user;
                    break;
                case !!inputObj.lastName:
                    if (user.lastName === inputObj.lastName) foundUser = user;
                    break;
                default:
                    foundUser = null
                    break;
            }
        };
        return foundUser
    }
}