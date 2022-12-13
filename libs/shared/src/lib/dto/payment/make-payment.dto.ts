import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class MakePaymentDto {
    @IsNotEmpty()
    @IsUUID(4)
    userId: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;
}