import { IsNotEmpty } from 'class-validator';

export class AcceptFriendRequestDTO {
  @IsNotEmpty()
  senderEncryptedSymmetricKey: string;

  @IsNotEmpty()
  receiverEncryptedSymmetricKey: string;
}
