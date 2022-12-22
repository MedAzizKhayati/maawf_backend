import { IsArray, IsDefined, IsNotEmpty, IsOptional } from "class-validator";

export class CreateGroupChatDTO {
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsNotEmpty()
    encryptedSymmetricKey: string;

    @IsDefined()
    @IsArray()
    members: Member[] = [];
}

export class Member {
    id: string;
    encryptedSymmetricKey: string;
}