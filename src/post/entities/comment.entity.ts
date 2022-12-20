import { GenericEntity } from '@/generics/entity';
import { Post } from './post.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Profile } from '@/profile/entities/profile.entity';

@Entity()
export class Comment extends GenericEntity {
  @Column()
  description: string;
  @ManyToOne(() => Post, post => post.comments)
  post: Post;
  @ManyToOne(() => Profile, profile => profile.comments)
  profile: Profile;
}
