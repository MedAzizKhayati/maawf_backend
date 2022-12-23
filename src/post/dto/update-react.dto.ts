import { ApiProperty } from '@nestjs/swagger';

export class UpdateReactDto {

  @ApiProperty({ description: 'react type' })
  react: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
}
