import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { RoleMenu } from '../../roles/entities/role-menu.entity';

@Entity('menus')
@Index(['parentId', 'sort'])
@Index(['path'])
@Index(['status'])
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, comment: '菜单名称' })
  name: string;

  // 移除 code 字段
  // @Column({ length: 100, unique: true, comment: '菜单编码' })
  // code: string;

  @Column({ length: 100, nullable: true, comment: '菜单图标' })
  icon?: string;

  @Column({ length: 255, nullable: true, comment: '菜单路径' })
  path?: string;

  @Column({ nullable: true, comment: '父级菜单ID' })
  parentId?: string;

  @Column({ type: 'text', nullable: true, comment: '物化路径，如: 1/2/3' })
  materializedPath?: string;

  @Column({ type: 'int', default: 0, comment: '层级深度' })
  level: number;

  @Column({ type: 'int', default: 0, comment: '排序值' })
  sort: number;

  @Column({
    type: 'enum',
    enum: ['enabled', 'disabled'],
    default: 'enabled',
    comment: '状态',
  })
  status: 'enabled' | 'disabled';

  @Column({ type: 'json', nullable: true, comment: '菜单元数据' })
  metadata?: Record<string, any>;

  @ManyToOne(() => Menu, (menu) => menu.children)
  @JoinColumn({ name: 'parentId' })
  parent?: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @OneToMany(() => RoleMenu, (roleMenu) => roleMenu.menu)
  roleMenus: RoleMenu[];

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
