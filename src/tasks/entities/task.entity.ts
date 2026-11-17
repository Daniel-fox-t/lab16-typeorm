import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: false })
  completed!: boolean;

  @ManyToOne(() => User, (user: User) => user.tasks, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ nullable: true })
  userId!: number;
}