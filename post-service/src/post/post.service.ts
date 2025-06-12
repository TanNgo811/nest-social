import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import {
  CreatePostRequest,
  PostResponse,
  GetPostRequest,
  GetPostsRequest,
  GetPostsResponse,
  UpdatePostRequest,
  DeletePostRequest,
  DeletePostResponse,
  Post as PostInterface // Alias to avoid conflict with entity
} from './interfaces/post.interface';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  /**
   * Creates a new post.
   * @param {CreatePostRequest} data - The data for creating a new post.
   * @returns {Promise<PostResponse>} - The response containing the created post or an error.
   */
  async createPost(data: CreatePostRequest): Promise<PostResponse> {
    this.logger.log(`Attempting to create post for userId: ${data.userId}`);
    try {
      const newPost = this.postsRepository.create({
        userId: data.userId,
        title: data.title,
        content: data.content,
      });
      const savedPost = await this.postsRepository.save(newPost);
      this.logger.log(`Post created successfully with ID: ${savedPost.id}`);
      return { post: this.mapPostEntityToInterface(savedPost), success: true, message: 'Post created successfully' };
    } catch (error) {
      this.logger.error(`Error creating post for userId ${data.userId}: ${error.message}`, error.stack);
      return { post: null, success: false, message: 'Failed to create post' };
    }
  }

  /**
   * Retrieves a single post by its ID.
   * @param {GetPostRequest} data - The request containing the post ID.
   * @returns {Promise<PostResponse>} - The response containing the post or an error if not found.
   */
  async getPost(data: GetPostRequest): Promise<PostResponse> {
    this.logger.log(`Attempting to retrieve post with ID: ${data.id}`);
    try {
      const post = await this.postsRepository.findOne({ where: { id: data.id } });
      if (!post) {
        this.logger.warn(`Post not found with ID: ${data.id}`);
        throw new NotFoundException(`Post with ID ${data.id} not found`);
      }
      this.logger.log(`Post retrieved successfully with ID: ${post.id}`);
      return { post: this.mapPostEntityToInterface(post), success: true, message: 'Post retrieved successfully' };
    } catch (error) {
      this.logger.error(`Error retrieving post with ID ${data.id}: ${error.message}`, error.stack);
      return { post: null, success: false, message: error.message || 'Failed to retrieve post' };
    }
  }

  /**
   * Retrieves a list of posts.
   * @param {GetPostsRequest} data - Optional parameters for limiting and offsetting results.
   * @returns {Promise<GetPostsResponse>} - The response containing a list of posts.
   */
  async getPosts(data: GetPostsRequest): Promise<GetPostsResponse> {
    this.logger.log(`Attempting to retrieve posts with limit: ${data.limit}, offset: ${data.offset}`);
    try {
      const posts = await this.postsRepository.find({
        take: data.limit || 10, // Default limit to 10
        skip: data.offset || 0, // Default offset to 0
        order: { createdAt: 'DESC' }, // Order by creation date descending
      });
      this.logger.log(`Retrieved ${posts.length} posts.`);
      return { posts: posts.map(p => this.mapPostEntityToInterface(p)) };
    } catch (error) {
      this.logger.error(`Error retrieving posts: ${error.message}`, error.stack);
      return { posts: [] }; // Return empty array on error
    }
  }

  /**
   * Updates an existing post.
   * @param {UpdatePostRequest} data - The data for updating a post, including its ID.
   * @returns {Promise<PostResponse>} - The response containing the updated post or an error.
   */
  async updatePost(data: UpdatePostRequest): Promise<PostResponse> {
    this.logger.log(`Attempting to update post with ID: ${data.id}`);
    try {
      const post = await this.postsRepository.findOne({ where: { id: data.id } });
      if (!post) {
        this.logger.warn(`Update failed: Post not found with ID: ${data.id}`);
        throw new NotFoundException(`Post with ID ${data.id} not found`);
      }

      // Update fields if provided
      if (data.title !== undefined) {
        post.title = data.title;
      }
      if (data.content !== undefined) {
        post.content = data.content;
      }

      const updatedPost = await this.postsRepository.save(post);
      this.logger.log(`Post updated successfully with ID: ${updatedPost.id}`);
      return { post: this.mapPostEntityToInterface(updatedPost), success: true, message: 'Post updated successfully' };
    } catch (error) {
      this.logger.error(`Error updating post with ID ${data.id}: ${error.message}`, error.stack);
      return { post: null, success: false, message: error.message || 'Failed to update post' };
    }
  }

  /**
   * Deletes a post by its ID.
   * @param {DeletePostRequest} data - The request containing the post ID to delete.
   * @returns {Promise<DeletePostResponse>} - The response indicating success or failure of deletion.
   */
  async deletePost(data: DeletePostRequest): Promise<DeletePostResponse> {
    this.logger.log(`Attempting to delete post with ID: ${data.id}`);
    try {
      const result = await this.postsRepository.delete(data.id);
      if (result.affected === 0) {
        this.logger.warn(`Deletion failed: Post not found with ID: ${data.id}`);
        throw new NotFoundException(`Post with ID ${data.id} not found`);
      }
      this.logger.log(`Post deleted successfully with ID: ${data.id}`);
      return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting post with ID ${data.id}: ${error.message}`, error.stack);
      return { success: false, message: error.message || 'Failed to delete post' };
    }
  }

  /**
   * Maps a Post entity object to a Post interface object for gRPC response.
   * This handles Date objects being converted to ISO strings for gRPC.
   * @param {Post} postEntity - The TypeORM Post entity.
   * @returns {PostInterface} - The gRPC-compatible Post interface.
   */
  private mapPostEntityToInterface(postEntity: Post): PostInterface {
    return {
      id: postEntity.id,
      userId: postEntity.userId,
      title: postEntity.title,
      content: postEntity.content,
      createdAt: postEntity.createdAt.toISOString(), // Convert Date to string for gRPC
      updatedAt: postEntity.updatedAt.toISOString(), // Convert Date to string for gRPC
    };
  }
}