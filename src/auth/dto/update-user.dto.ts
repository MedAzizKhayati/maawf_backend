import { PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-user.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
