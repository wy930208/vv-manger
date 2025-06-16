/*
 * @Description:
 * @Author: huangzhiwei
 * @Date: 2025-06-09 00:29:22
 * @Email: huangzhiwei4@joyy.sg
 * @LastEditTime: 2025-06-14 15:57:21
 */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.validateUser(username, password);
      const { password: _, ...result } = user;
      return result;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return null;
    }
  }

  login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
      },
    };
  }

  async register(username: string, password: string) {
    const createUserDto: CreateUserDto = {
      username,
      password,
    };
    const user = await this.usersService.create(createUserDto);
    return this.login(user);
  }
}
