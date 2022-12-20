import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { React } from './entities/react.entity';

@Module({
  controllers: [PostController],
  providers: [PostService]
  ,
  imports: [TypeOrmModule.forFeature([Post,Comment,React]),]
})
export class PostModule {}