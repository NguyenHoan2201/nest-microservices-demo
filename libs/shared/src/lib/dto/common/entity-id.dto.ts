import { IsUUID } from "class-validator";

export class EntityIDDto {

    @IsUUID(4)
    id: string
}