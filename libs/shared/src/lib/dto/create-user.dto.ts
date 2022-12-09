import { Length, IsEmail, IsNotEmpty, IsAlphanumeric } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsAlphanumeric()
    @Length(6, 255)
    readonly password: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly fullName: string;
}