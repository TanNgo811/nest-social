import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PostService } from './post.service';
import {
  CreatePostRequest,
  PostResponse,
  GetPostRequest,
  GetPostsRequest,
  GetPostsResponse,
  UpdatePostRequest,
  DeletePostRequest,
  DeletePostResponse,
} from './interfaces/post.interface';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * Handles creating a new post via gRPC.
   * Maps to the 'CreatePost' method in the post.proto service.
   * @param {CreatePostRequest} data - The request data for creating a post.
   * @returns {Promise<PostResponse>} - The response containing the created post or an error.
   */
  @GrpcMethod('PostService', 'CreatePost')
  async createPost(data: CreatePostRequest): Promise<PostResponse> {
    return this.postService.createPost(data);
  }

  /**
   * Handles retrieving a single post by ID via gRPC.
   * Maps to the 'GetPost' method in the post.proto service.
   * @param {GetPostRequest} data - The request data containing the post ID.
   * @returns {Promise<PostResponse>} - The response containing the post or an error if not found.
   */
  @GrpcMethod('PostService', 'GetPost')
  async getPost(data: GetPostRequest): Promise<PostResponse> {
    return this.postService.getPost(data);
  }

  /**
   * Handles retrieving a list of posts via gRPC.
   * Maps to the 'GetPosts' method in the post.proto service.
   * @param {GetPostsRequest} data - Optional request data for pagination/filtering.
   * @returns {Promise<GetPostsResponse>} - The response containing a list of posts.
   */
  @GrpcMethod('PostService', 'GetPosts')
  async getPosts(data: GetPostsRequest): Promise<GetPostsResponse> {
    return this.postService.getPosts(data);
  }

  /**
   * Handles updating an existing post via gRPC.
   * Maps to the 'UpdatePost' method in the post.proto service.
   * @param {UpdatePostRequest} data - The request data for updating a post.
   * @returns {Promise<PostResponse>} - The response containing the updated post or an error.
   */
  @GrpcMethod('PostService', 'UpdatePost')
  async updatePost(data: UpdatePostRequest): Promise<PostResponse> {
    return this.postService.updatePost(data);
  }

  /**
   * Handles deleting a post by ID via gRPC.
   * Maps to the 'DeletePost' method in the post.proto service.
   * @param {DeletePostRequest} data - The request data for deleting a post.
   * @returns {Promise<DeletePostResponse>} - The response indicating success or failure of deletion.
   */
  @GrpcMethod('PostService', 'DeletePost')
  async deletePost(data: DeletePostRequest): Promise<DeletePostResponse> {
    return this.postService.deletePost(data);
  }
}