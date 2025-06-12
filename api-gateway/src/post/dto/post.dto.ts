import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, MinLength } from 'class-validator';

// DTO for creating a new post
export class CreatePostDto {
  @ApiProperty({ description: 'Title of the post', example: 'My First Post' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({ description: 'Content of the post', example: 'This is the amazing content of my first post.' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

// DTO for updating an existing post (all fields are optional for partial updates)
export class UpdatePostDto extends PartialType(CreatePostDto) {
  // No additional fields needed here, PartialType makes CreatePostDto fields optional
}

// DTO representing a single Post object returned in responses
export class PostResponseDto {
  @ApiProperty({ description: 'Unique ID of the post', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'ID of the user who created the post', example: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Title of the post', example: 'My Updated Post' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Content of the post', example: 'Updated content here.' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Timestamp when the post was created (ISO 8601 string)', example: '2023-10-27T10:00:00.000Z' })
  @IsString()
  createdAt: string;

  @ApiProperty({ description: 'Timestamp when the post was last updated (ISO 8601 string)', example: '2023-10-27T10:30:00.000Z' })
  @IsString()
  updatedAt: string;
}

// DTO representing a list of Post objects for GetPosts response
export class PostListResponseDto {
  @ApiProperty({ type: [PostResponseDto], description: 'Array of post objects' })
  posts: PostResponseDto[];
}