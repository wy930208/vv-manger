import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import * as bcrypt from 'bcrypt';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 检查手机号是否已存在
    if (createUserDto.phone) {
      const existingPhone = await this.usersRepository.findOne({
        where: { phone: createUserDto.phone },
      });
      if (existingPhone) {
        throw new ConflictException('手机号已存在');
      }
    }

    // 检查邮箱是否已存在
    if (createUserDto.email) {
      const existingEmail = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('邮箱已存在');
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const { roleIds, ...userData } = createUserDto;
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    // 处理用户角色关联
    if (roleIds && roleIds.length > 0) {
      const userRoles = roleIds.map(roleId => 
        this.userRoleRepository.create({
          userId: savedUser.id,
          roleId,
        })
      );
      await this.userRoleRepository.save(userRoles);
    }

    return savedUser;
  }

  async findAll(queryUserDto: QueryUserDto): Promise<PaginatedResult<User>> {
    const {
      page = 1,
      limit = 10,
      username,
      nickname,
      phone,
      isActive,
    } = queryUserDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<User> = {};
    if (username) where.username = ILike(`%${username}%`);
    if (nickname) where.nickname = ILike(`%${nickname}%`);
    if (phone) where.phone = ILike(`%${phone}%`);
    if (isActive !== undefined) where.isActive = isActive;

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['userRoles', 'userRoles.role', 'store'],
    });

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: ['userRoles', 'userRoles.role', 'store']
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // 检查用户名是否已存在（排除当前用户）
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUser) {
        throw new ConflictException('用户名已存在');
      }
    }

    // 检查邮箱是否已存在（排除当前用户）
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('邮箱已存在');
      }
    }

    // 如果更新密码，需要加密
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const { roleIds, ...userData } = updateUserDto;
    await this.usersRepository.update(id, userData);

    // 处理用户角色更新
    if (roleIds !== undefined) {
      // 删除现有的用户角色关联
      await this.userRoleRepository.delete({ userId: id });
      
      // 添加新的用户角色关联
      if (roleIds.length > 0) {
        const userRoles = roleIds.map(roleId => 
          this.userRoleRepository.create({
            userId: id,
            roleId,
          })
        );
        await this.userRoleRepository.save(userRoles);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('用户不存在');
    }
  }

  // 保留原有的认证相关方法
  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.findByUsername(username);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('密码错误');
    }

    return user;
  }
}
