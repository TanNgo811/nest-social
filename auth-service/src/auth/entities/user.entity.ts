import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  // Auto-generated UUID as primary key
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Unique username column
  @Column({ unique: true })
  username: string;

  // Unique email column
  @Column({ unique: true })
  email: string;

  // Hashed password column
  @Column()
  password: string;

  // Optional: Add timestamps for creation and update
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
