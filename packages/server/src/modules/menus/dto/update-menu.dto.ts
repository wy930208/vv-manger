/*
 * @Description:
 * @Author: huangzhiwei
 * @Date: 2025-06-10 00:48:36
 * @Email: huangzhiwei4@joyy.sg
 * @LastEditTime: 2025-06-10 00:48:38
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
