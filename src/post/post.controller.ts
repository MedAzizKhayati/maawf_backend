import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/user.decorator';
import { User } from '@/auth/entities/user.entity';
import { CreateReactDto } from './dto/react.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') take = 10) {
    return this.postService.findAll({
      page,
      take,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(@GetUser() user: User, @Body() createPostDto: CreatePostDto) {
    createPostDto.profile = user.profile;
    return this.postService.create(createPostDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removePost(@Param('id') id: string) {
    return this.postService.delete(id);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  ReactToPost(@GetUser() user: User,@Body() reactDto:CreateReactDto)  {
  
  }

}
