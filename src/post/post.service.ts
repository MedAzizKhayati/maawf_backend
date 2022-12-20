import { GenericsService } from '@/generics/service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService extends GenericsService<Post, CreatePostDto, UpdatePostDto> {
  constructor(
    @InjectRepository(Post) repo: Repository<Post>
  ) {
    super(repo);
  }
}
