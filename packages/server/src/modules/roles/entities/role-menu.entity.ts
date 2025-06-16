import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Role } from './role.entity';
import { Menu } from '../../menus/entities/menu.entity';

@Entity('role_menus')
@Index(['roleId', 'menuId'], { unique: true })
export class RoleMenu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '角色ID' })
  roleId: string;

  @Column({ comment: '菜单ID' })
  menuId: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  // 关联角色
  @ManyToOne(() => Role, (role) => role.roleMenus, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  // 关联菜单
  @ManyToOne(() => Menu, (menu) => menu.roleMenus, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'menuId' })
  menu: Menu;
}
