import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateMemberDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  nickname: string;
}
