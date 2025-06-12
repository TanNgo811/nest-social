import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  PostService as PostServiceInterface,
  CreatePostRequest,
  PostResponse,
  GetPostRequest,
  GetPostsRequest,
  GetPostsResponse,
  UpdatePostRequest,
  DeletePostRequest,
  DeletePostResponse,
  Post as PostInterface // Alias to avoid conflict
} from './interfaces/post.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PostService implements OnModuleInit {
  private postServiceGrpc: PostServiceInterface;

  // Inject the gRPC client configured in AppModule
  constructor(@Inject('POST_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    // Get the PostService (gRPC service) from the gRPC client
    this.postServiceGrpc = this.client.getService<PostServiceInterface>('PostService');
  }

  /**
   * Calls the Post microservice's CreatePost gRPC method.
   * @param {CreatePostRequest} data - The data for creating a new post.
   * @returns {Promise<PostResponse>} - Response from the Post microservice.
   */
  async createPost(data: CreatePostRequest): Promise<PostResponse> {
    return firstValueFrom(this.postServiceGrpc.CreatePost(data));
  }

  /**
   * Calls the Post microservice's GetPost gRPC method.
   * @param {string} id - The ID of the post to retrieve.
   * @returns {Promise<PostResponse>} - Response from the Post microservice.
   */
  async getPost(id: string): Promise<PostResponse> {
    return firstValueFrom(this.postServiceGrpc.GetPost({ id }));
  }

  /**
   * Calls the Post microservice's GetPosts gRPC method.
   * @param {number} [limit] - Optional limit for pagination.
   * @param {number} [offset] - Optional offset for pagination.
   * @returns {Promise<GetPostsResponse>} - Response from the Post microservice containing a list of posts.
   */
  async getPosts(limit?: number, offset?: number): Promise<GetPostsResponse> {
    const request: GetPostsRequest = {};
    if (limit !== undefined) request.limit = limit;
    if (offset !== undefined) request.offset = offset;
    return firstValueFrom(this.postServiceGrpc.GetPosts(request));
  }

  /**
   * Calls the Post microservice's UpdatePost gRPC method.
   * @param {string} id - The ID of the post to update.
   * @param {UpdatePostRequest} data - The data for updating the post.
   * @returns {Promise<PostResponse>} - Response from the Post microservice.
   */
  async updatePost(id: string, data: Partial<UpdatePostRequest>): Promise<PostResponse> {
    return firstValueFrom(this.postServiceGrpc.UpdatePost({ id, ...data }));
  }

  /**
   * Calls the Post microservice's DeletePost gRPC method.
   * @param {string} id - The ID of the post to delete.
   * @returns {Promise<DeletePostResponse>} - Response from the Post microservice.
   */
  async deletePost(id: string): Promise<DeletePostResponse> {
    return firstValueFrom(this.postServiceGrpc.DeletePost({ id }));
  }
}