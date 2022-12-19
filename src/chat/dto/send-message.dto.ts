import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class SendMessageDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    text: string;

    @IsNotEmpty()
    @IsString()
    groupChatId: string;

    attachments?: string[] = [];
}