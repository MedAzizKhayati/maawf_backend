import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class SendMessageDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    @IsOptional()
    text?: string;

    @IsNotEmpty()
    @IsString()
    groupChatId: string;

    attachments?: string[] = [];

    @IsOptional()
    isEncrypted?: boolean = false;
}