import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
    @ApiPropertyOptional({
        description: 'The bio of the user',
    })
    @IsOptional()
    bio: string;
}
