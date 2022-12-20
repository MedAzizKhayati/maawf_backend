import { Profile } from "@/profile/entities/profile.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty({
        minLength: 3,
        maxLength: 20,
        description: "Title of the post, letters and spaces only.",
    })
    title: string;
    @ApiProperty({
        description: "Description of the post, letters and spaces only",
    })
    description: string;
    profile:Profile;
}
