import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto, PostResponseDto, PostListResponseDto } from './dto/post.dto';
import { AuthGuard } from '../common/guards/auth.guard'; // Import the custom AuthGuard
import { Request } from 'express'; // Import Request from express to get user object

// Extend Request to include `user` property for userId
declare module 'express' {
  interface Request {
    user?: {
      userId: string;
    };
  }
}

@ApiTags('Posts') // Categorize endpoints under 'Posts' in Swagger UI
@ApiBearerAuth('JWT-auth') // Apply JWT Bearer authentication requirement to all operations in this controller
@UseGuards(AuthGuard) // Apply the AuthGuard to all routes in this controller
@Controller('posts') // Base path for these endpoints
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * Creates a new post. Requires authentication.
   * The userId is extracted from the authenticated request.
   * @param {CreatePostDto} createPostDto - The data for creating a new post.
   * @param {Request} req - The Express request object containing authenticated user info.
   * @returns {Promise<PostResponseDto>} - The created post details.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Set HTTP status code to 201 Created
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post successfully created', type: PostResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request): Promise<PostResponseDto> {
    const userId = req?.user?.userId; // Get userId from the authenticated request
    if (!userId) {
      throw new Error('User not authenticated'); // Should be a UnauthorizedException in production
    }
    const result = await this.postService.createPost({ ...createPostDto, userId });
    if (!result.success) {
      throw new Error(result.message);
    }
    return result.post;
  }

  /**
   * Retrieves a single post by its ID. Requires authentication.
   * @param {string} id - The ID of the post to retrieve.
   * @returns {Promise<PostResponseDto>} - The post details.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully', type: PostResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPost(@Param('id') id: string): Promise<PostResponseDto> {
    const result = await this.postService.getPost(id);
    if (!result.success) {
      throw new Error(result.message); // Should be a NotFoundException in production
    }
    return result.post;
  }

  /**
   * Retrieves a list of posts. Requires authentication.
   * Supports pagination using limit and offset.
   * @param {number} limit - Maximum number of posts to return.
   * @param {number} offset - Number of posts to skip.
   * @returns {Promise<PostListResponseDto>} - A list of posts.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a list of posts' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of posts to return (default: 10)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of posts to skip (default: 0)' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully', type: PostListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPosts(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<PostListResponseDto> {
    const result = await this.postService.getPosts(limit, offset);
    // PostListResponseDto expects `posts` directly
    return { posts: result.posts };
  }

  /**
   * Updates an existing post. Requires authentication.
   * @param {string} id - The ID of the post to update.
   * @param {UpdatePostDto} updatePostDto - The updated data for the post.
   * @returns {Promise<PostResponseDto>} - The updated post details.
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully', type: PostResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
    const result = await this.postService.updatePost(id, updatePostDto);
    if (!result.success) {
      throw new Error(result.message); // Should be a NotFoundException in production
    }
    return result.post;
  }

  /**
   * Deletes a post by its ID. Requires authentication.
   * @param {string} id - The ID of the post to delete.
   * @returns {Promise<void>} - No content on successful deletion.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Set HTTP status code to 204 No Content
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiResponse({ status: 204, description: 'Post successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deletePost(@Param('id') id: string): Promise<void> {
    const result = await this.postService.deletePost(id);
    if (!result.success) {
      throw new Error(result.message); // Should be a NotFoundException in production
    }
    // No content to return for 204 No Content
  }
}