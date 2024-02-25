import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from './enum';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/entity';

@Entity()
export class Transaction {
  @PrimaryColumn()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'tx-387c40a1-aaa4-4f85-935e-9049ffa189f5' })
  id: string;

  @Column({ name: 'user_id' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'us-387c40a1-aaa4-4f85-935e-9049ffa189f5' })
  userId: string;

  @Column({ name: 'amount', type: 'float' })
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 100 })
  @IsPositive({ message: 'Amount must be greater than zero' })
  amount: number;

  @Column({ enum: Status, default: Status.PENDING })
  @IsEnum(Status)
  @IsNotEmpty()
  @ApiProperty({ enum: Status, example: Status.PENDING })
  status: Status;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ name: 'created_at' })
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ name: 'updated_at' })
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @BeforeInsert()
  generateUUID(): void {
    this.id = `tx-${uuidv4()}`;
  }
}
