import { GenericEntity } from '@/generics/entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Friendship extends GenericEntity {
  @ManyToOne(() => Profile, profile => profile.outgoingFriendRequests, {
    eager: true,
  })
  sender: Profile;

  @ManyToOne(() => Profile, profile => profile.incomingFriendRequests, {
    eager: true,
  })
  receiver: Profile;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'blocked'],
  })
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'blocked';
}
