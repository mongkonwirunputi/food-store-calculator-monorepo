import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('red_orders_log')
export class RedOrderLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  orderedAt: Date;
}

