import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: '客户名称不能为空' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '电话不能为空' })
  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  level: string;

  @IsOptional()
  points?: number;

  @IsOptional()
  @IsUUID('4', { message: '门店ID格式不正确' })
  storeId?: string;

  @IsNotEmpty({ message: '状态不能为空' })
  @IsString()
  status: string;
}
