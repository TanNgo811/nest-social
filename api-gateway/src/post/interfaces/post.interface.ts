import { Observable } from 'rxjs';

// Post Microservice RPC service interface
export interface PostService {
  CreatePost(request: CreatePostRequest): Observable<PostResponse>;
  GetPost(request: GetPostRequest): Observable<PostResponse>;
  GetPosts(request: GetPostsRequest): Observable<GetPostsResponse>;
  UpdatePost(request: UpdatePostRequest): Observable<PostResponse>;
  DeletePost(request: DeletePostRequest): Observable<DeletePostResponse>;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  userId: string;
  title: string;
  content: string;
}

export interface GetPostRequest {
  id: string;
}

export interface GetPostsRequest {
  limit?: number;
  offset?: number;
}

export interface GetPostsResponse {
  posts: Post[];
}

export interface UpdatePostRequest {
  id: string;
  title?: string;
  content?: string;
}

export interface DeletePostRequest {
  id: string;
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}

export interface PostResponse {
  post: Post | null;
  success: boolean;
  message: string;
}