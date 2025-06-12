import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Post {
  // Auto-generated UUID as primary key
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ID of the user who created the post
  @Column()
  userId: string;

  // Title of the post
  @Column()
  title: string;

  // Content of the post
  @Column({ type: 'text' })
  content: string;

  // Timestamp for when the post was created
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Timestamp for when the post was last updated
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}