import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('customer_records')
export class CustomerRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '客户ID' })
  customerId: string;

  @Column()
  type: string; // 'phone', 'email', 'visit', 'other'

  @Column('text')
  description: string;

  // 关联操作员
  @Column({ nullable: true, comment: '操作员ID' })
  operatorId: string;

  @ManyToOne(() => User, (user) => user.operatedRecords, { nullable: true })
  @JoinColumn({ name: 'operatorId' })
  operator: User;

  // 关联门店
  @Column({ nullable: true, comment: '门店ID' })
  storeId: string;

  @ManyToOne(() => Store, { nullable: true })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.records)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
}
