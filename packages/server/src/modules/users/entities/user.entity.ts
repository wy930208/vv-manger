import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Store } from '../../stores/entities/store.entity';
import { UserRole } from './user-role.entity';
import { CustomerRecord } from '../../customers/entities/customer-record.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, length: 50 })
  nickname: string;

  @Column({ nullable: true, length: 15, unique: true })
  phone: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  // 关联门店
  @Column({ nullable: true, comment: '所属门店ID' })
  storeId: string;

  @ManyToOne(() => Store, { nullable: true })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  // 用户角色关联
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  // 操作的客户记录
  @OneToMany(() => CustomerRecord, (record) => record.operator)
  operatedRecords: CustomerRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
