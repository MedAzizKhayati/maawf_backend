import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
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
}
