import { GenericEntity } from '@/generics/entity';
import { Profile } from '@/profile/entities/profile.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';
import { React } from './react.entity';

@Entity()
export class Post extends GenericEntity {
  @Column()
  title: string;
  @Column()
  description: string;
  @ManyToOne(() => Profile, profile => profile.posts)
  profile: Profile;
  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];
  @OneToMany(()=>React,react=>react.profile)
  public reacts: React[];
}
