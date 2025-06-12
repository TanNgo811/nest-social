export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string; // ISO 8601 string representation of Date
  updatedAt: string; // ISO 8601 string representation of Date
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
  title?: string; // Optional field for partial updates
  content?: string; // Optional field for partial updates
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