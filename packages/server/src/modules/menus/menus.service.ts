import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    // 验证父级菜单是否存在
    if (createMenuDto.parentId) {
      const parentMenu = await this.menuRepository.findOne({
        where: { id: createMenuDto.parentId },
      });
      if (!parentMenu) {
        throw new NotFoundException('Parent menu not found');
      }
    }

    const menu = this.menuRepository.create({
      ...createMenuDto,
      level: createMenuDto.parentId ? 1 : 0, // 简化层级计算
      sort: createMenuDto.sort || 0,
      status: createMenuDto.status || 'enabled',
    });

    const savedMenu = await this.menuRepository.save(menu);
    await this.updateMaterializedPath(savedMenu.id);

    return this.findOne(savedMenu.id);
  }

  async findAll(queryDto?: QueryMenuDto): Promise<Menu[]> {
    const query = this.menuRepository.createQueryBuilder('menu');

    if (queryDto?.name) {
      query.andWhere('menu.name LIKE :name', { name: `%${queryDto.name}%` });
    }

    if (queryDto?.status !== undefined) {
      query.andWhere('menu.status = :status', { status: queryDto.status });
    }

    return query.orderBy('menu.sort', 'ASC').getMany();
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOne(id);

    // 检查父级菜单是否存在且不是自己
    if (updateMenuDto.parentId && updateMenuDto.parentId !== id) {
      const parentMenu = await this.menuRepository.findOne({
        where: { id: updateMenuDto.parentId },
      });
      if (!parentMenu) {
        throw new NotFoundException('Parent menu not found');
      }
    }

    await this.menuRepository.update(id, updateMenuDto);

    // 如果父级发生变化，更新物化路径
    if (
      updateMenuDto.parentId !== undefined &&
      updateMenuDto.parentId !== menu.parentId
    ) {
      await this.updateMaterializedPath(id);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    // 检查是否有子菜单
    const children = await this.menuRepository.find({
      where: { parentId: id },
    });

    if (children.length > 0) {
      throw new BadRequestException('Cannot delete menu with children');
    }

    const result = await this.menuRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
  }

  async findTree(): Promise<Menu[]> {
    const allMenus = await this.menuRepository.find({
      order: { sort: 'ASC' },
    });

    const menuMap = new Map<string, Menu & { children: Menu[] }>();
    const rootMenus: (Menu & { children: Menu[] })[] = [];

    // 创建菜单映射
    allMenus.forEach((menu) => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    // 构建树形结构
    allMenus.forEach((menu) => {
      const menuWithChildren = menuMap.get(menu.id)!;
      if (menu.parentId) {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children.push(menuWithChildren);
        }
      } else {
        rootMenus.push(menuWithChildren);
      }
    });

    return rootMenus;
  }

  private async updateMaterializedPath(menuId: string): Promise<void> {
    const menu = await this.menuRepository.findOne({
      where: { id: menuId },
      relations: ['parent'],
    });

    if (!menu) return;

    let path = menu.id;
    let level = 0;
    let currentMenu = menu;

    // 构建物化路径
    while (currentMenu.parent) {
      path = `${currentMenu.parent.id}/${path}`;
      level++;
      const parentMenu = await this.menuRepository.findOne({
        where: { id: currentMenu.parent.id },
        relations: ['parent'],
      });
      if (!parentMenu) break;
      currentMenu = parentMenu;
    }

    // 更新当前菜单
    await this.menuRepository.update(menuId, {
      materializedPath: path,
      level,
    });

    // 更新所有子菜单的物化路径
    const descendants = await this.findDescendants(menuId);
    for (const descendant of descendants) {
      await this.updateMaterializedPath(descendant.id);
    }
  }

  private async updateDescendantsPath(menuId: string): Promise<void> {
    const children = await this.menuRepository.find({
      where: { parentId: menuId },
    });

    for (const child of children) {
      await this.updateMaterializedPath(child.id);
    }
  }

  private async findDescendants(menuId: string): Promise<Menu[]> {
    return this.menuRepository.find({
      where: { parentId: menuId },
    });
  }

  private async wouldCreateCircularReference(
    menuId: string,
    newParentId: string,
  ): Promise<boolean> {
    const descendants = await this.findAllDescendants(menuId);
    return descendants.some((descendant) => descendant.id === newParentId);
  }

  private async findAllDescendants(menuId: string): Promise<Menu[]> {
    const directChildren = await this.findDescendants(menuId);
    let allDescendants = [...directChildren];

    for (const child of directChildren) {
      const childDescendants = await this.findAllDescendants(child.id);
      allDescendants = allDescendants.concat(childDescendants);
    }

    return allDescendants;
  }
}
