import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity.js';
import { Role } from './role.entity.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Task, (task: Task) => task.user)
  tasks!: Task[];

  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  roles!: Role[];
}