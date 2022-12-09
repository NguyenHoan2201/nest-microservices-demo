import { Injectable } from '@nestjs/common';
import { userDatabase } from './user.database';
import { UserMock } from './user.database';

@Injectable()
export class UsersRepository {
    private readonly users: Map<number, UserMock> = userDatabase;

    save(user: UserMock) {
        const id = this.users.size + 1
        this.users.set(id, { ...user, id });
    }

    findOne(id: number) {
        return this.users.get(id);
    }

    findOneBy(inputObj: Partial<UserMock>) {
        let foundUser: UserMock = null;

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