import { Length, IsEmail, IsAlphanumeric } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {

    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsAlphanumeric()
    @Length(6, 255)
    readonly password: string;
}