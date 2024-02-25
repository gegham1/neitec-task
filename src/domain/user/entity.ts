import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from './enums';
import { Transaction } from '../transaction/entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryColumn()
  @ApiProperty({ example: 'us-de2515dd-6360-4c71-a088-0252361cf1ea' })
  id: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Elon Musk', nullable: true })
  fullname: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'elon.musk@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({
    enum: UserRole,
    default: UserRole.USER,
  })
  @ApiProperty({ example: UserRole.USER, enum: UserRole })
  @IsNotEmpty()
  @IsIn(Object.values(UserRole))
  role: UserRole;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  accessTokenKey: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;

  @BeforeInsert()
  generateUUID(): void {
    this.id = `us-${uuidv4()}`;
  }

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Promise<Transaction[]>;
}
