import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCustomerRecordDto {
  @IsNotEmpty({ message: '客户ID不能为空' })
  @IsUUID('4', { message: '客户ID格式不正确' })
  customerId: string;

  @IsNotEmpty({ message: '记录类型不能为空' })
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID('4', { message: '操作员ID格式不正确' })
  operatorId?: string;

  @IsOptional()
  @IsUUID('4', { message: '门店ID格式不正确' })
  storeId?: string;
}
