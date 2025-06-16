/*
 * @Description:
 * @Author: huangzhiwei
 * @Date: 2025-06-10 00:48:29
 * @Email: huangzhiwei4@joyy.sg
 * @LastEditTime: 2025-06-10 00:48:32
 */
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsObject,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMenuDto {
  @IsString()
  @Length(1, 100)
  name: string;

  // 移除 code 字段
  // @IsString()
  // @Length(1, 100)
  // code: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  icon?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  path?: string;

  @IsOptional()
  @IsUUID('4', { message: '父级菜单ID格式不正确' })
  parentId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  sort?: number;

  @IsOptional()
  @IsEnum(['enabled', 'disabled'])
  status?: 'enabled' | 'disabled';

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;
}
