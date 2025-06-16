import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CustomerRecord } from './customer-record.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  level: string; // 'normal', 'vip', 'premium'

  @Column({ default: 0 })
  points: number;

  // 关联门店
  @Column({ comment: '所属门店ID', nullable: true })
  storeId: string;

  @ManyToOne(() => Store, (store) => store.customers)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column()
  status: string; // 'active', 'inactive', 'blacklist'

  @OneToMany(() => CustomerRecord, (record) => record.customer)
  records: CustomerRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
