import { Injectable } from '@nestjs/common';
import { User } from '@microservices-demo/shared/entities';

@Injectable()
export class UsersRepository {
    private readonly users: Map<number, User> = new Map<number, User>();

    save(user: User) {
        const id = this.users.size + 1
        this.users.set(id, { ...user, id });
    }

    findOne(id: number) {
        return this.users.get(id);
    }
}