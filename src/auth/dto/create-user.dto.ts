import { CreateProfileDto } from '@/profile/dto/create-profile.dto';
import { Profile } from '@/profile/entities/profile.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateAuthDto extends CreateProfileDto {
    @IsEmail()
    @ApiProperty({
        description: 'The email of the user',
    })
    email: string;

    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    @ApiProperty({
        minLength: 8,
        description: 'Password of the user, must contain at least 1 lowercase, 1 uppercase, 1 number and 8 characters',
    })
    password: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'The encrypted private key of the user',
    })
    encryptedPrivateKey: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'The public key of the user',
    })
    publicKey: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'The certication request of the user',
    })
    csr: string;

    getProfileEntity(): Profile {
        const profile = new Profile();
        profile.firstName = this.firstName;
        profile.lastName = this.lastName;
        profile.gender = this.gender;
        profile.publicKey = this.publicKey;
        return profile;
    }
}