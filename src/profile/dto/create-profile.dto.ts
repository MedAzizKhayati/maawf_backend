import { IsEnum, IsOptional, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from "../enums/gender.enum";
import { Profile } from "../entities/profile.entity";


export class CreateProfileDto {
    @MinLength(3)
    @MaxLength(20)
    @ApiProperty({
        minLength: 3,
        maxLength: 20,
        description: "First name of the user, letters and spaces only.",
    })
    @Matches(/^[a-zA-Z ]+$/)
    firstName: string;

    @MinLength(3)
    @MaxLength(20)
    @ApiProperty({
        minLength: 3,
        maxLength: 20,
        description: 'The last name of the user, letters and spaces only.',
    })
    lastName: string;

    @IsOptional()
    @ApiPropertyOptional({
        type: "enum",
        enum: Gender,
        description: 'User gender',
    })
    @IsEnum(Gender)
    gender: Gender;
}
