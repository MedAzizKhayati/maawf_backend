import { Profile } from '@/profile/entities/profile.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';

export class CreateReactDto {
  @ApiProperty({ description: 'react type' })
  react: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
  profile: Profile;
  post: Post;
}
