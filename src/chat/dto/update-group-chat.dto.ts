import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateGroupChatDTO {
    @IsNotEmpty()
    @IsDefined()
    id: string;

    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsOptional()
    newMembers?: string[] = [];

    @IsOptional()
    removeMembers?: string[] = [];
}