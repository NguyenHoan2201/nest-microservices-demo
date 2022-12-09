import { Entity, Column, BeforeInsert } from "typeorm";
import { Exclude } from "class-transformer";
import { compare, hash } from "bcrypt";
import { AbstractEntity } from "../common/abstract.entity";
import { Role } from "../../interfaces/user/user.interface";

@Entity()
export class User extends AbstractEntity {

    @Column({ type: "varchar", unique: true })
    email: string;

    @Exclude()
    @Column("varchar")
    password: string;

    @Column("varchar")
    fullName: string;

    @Column("timestamp without time zone", { nullable: true })
    lastLogin: Date;

    @Column("enum", {
        enum: Role,
        default: [Role.USER],
        array: true,
    })
    roles: Role[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }

    async updatePassword(plainPassword: string) {
        this.password = await hash(plainPassword, 10);
        await this.save();
    }

    public async isValidPassword(plainPassword: string): Promise<boolean> {
        return await compare(plainPassword, this.password);
    }
}