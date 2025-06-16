/*
 * @Description:
 * @Author: huangzhiwei
 * @Date: 2025-06-10 00:48:43
 * @Email: huangzhiwei4@joyy.sg
 * @LastEditTime: 2025-06-14 13:19:59
 */
import { IsOptional, IsEnum, IsString } from 'class-validator';

export class QueryMenuDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  parentId?: string | undefined;

  @IsOptional()
  @IsEnum(['enabled', 'disabled'])
  status?: 'enabled' | 'disabled';

  @IsOptional()
  @IsEnum(['tree', 'flat'])
  format?: 'tree' | 'flat';
}
