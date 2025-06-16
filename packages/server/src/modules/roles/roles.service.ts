/*
 * @Description:
 * @Author: huangzhiwei
 * @Date: 2025-06-10 01:17:42
 * @Email: huangzhiwei4@joyy.sg
 * @LastEditTime: 2025-06-14 15:45:14
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { RoleMenu } from './entities/role-menu.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(RoleMenu)
    private roleMenuRepository: Repository<RoleMenu>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { menuIds, ...roleData } = createRoleDto;
    const role = this.roleRepository.create(roleData);
    const savedRole = await this.roleRepository.save(role);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (menuIds && menuIds.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.assignMenusToRole(savedRole.id, menuIds.map(String));
    }

    return this.findOne(savedRole.id);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['roleMenus', 'roleMenus.menu'],
    });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['roleMenus', 'roleMenus.menu'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  async assignMenusToRole(roleId: string, menuIds: string[]): Promise<void> {
    // 删除现有的角色菜单关联
    await this.roleMenuRepository.delete({ roleId });

    // 创建新的角色菜单关联
    const roleMenus = menuIds.map((menuId) =>
      this.roleMenuRepository.create({ roleId, menuId }),
    );

    await this.roleMenuRepository.save(roleMenus);
  }

  async getRoleMenus(roleId: string): Promise<string[]> {
    const roleMenus = await this.roleMenuRepository.find({
      where: { roleId },
    });
    return roleMenus.map((rm) => rm.menuId);
  }
}
