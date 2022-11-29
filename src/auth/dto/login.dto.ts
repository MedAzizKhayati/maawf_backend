import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: 'The email of the user',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
    })
    @IsString()
    password: string;
}