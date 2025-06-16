/*
 * @Description:
 * @Author: huangzhiwei
 * @Date: 2025-06-10 01:16:53
 * @Email: huangzhiwei4@joyy.sg
 * @LastEditTime: 2025-06-10 01:18:41
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { RoleMenu } from './role-menu.entity';
import { UserRole } from '../../users/entities/user-role.entity';

@Entity('roles')
@Index(['status'])
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, comment: '角色名称' })
  name: string;

  @Column({ length: 100, unique: true, comment: '角色编码' })
  code: string;

  @Column({ type: 'text', nullable: true, comment: '角色描述' })
  description?: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
    comment: '状态',
  })
  status: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  // 角色菜单关联
  @OneToMany(() => RoleMenu, (roleMenu) => roleMenu.role)
  roleMenus: RoleMenu[];

  // 用户角色关联
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
