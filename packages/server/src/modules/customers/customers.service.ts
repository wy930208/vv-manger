/*
 * @Description:
 * @Author: huangzhiwei
 * @Date: 2025-06-10 00:02:04
 * @Email: huangzhiwei4@joyy.sg
 * @LastEditTime: 2025-06-14 13:20:57
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerRecordDto } from './dto/create-customer-record.dto';
import { Customer } from './entities/customer.entity';
import { CustomerRecord } from './entities/customer-record.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(CustomerRecord)
    private customerRecordsRepository: Repository<CustomerRecord>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customersRepository.create(createCustomerDto);
    return this.customersRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customersRepository.find({
      relations: ['store', 'records'],
    });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['store', 'records'],
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    await this.customersRepository.update(id, updateCustomerDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.customersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }

  // 客户记录相关方法
  async createRecord(
    createRecordDto: CreateCustomerRecordDto,
  ): Promise<CustomerRecord> {
    // 创建一个符合 CustomerRecord 实体结构的对象
    const recordData: Partial<CustomerRecord> = {
      customerId: createRecordDto.customerId,
      type: createRecordDto.type,
      description: createRecordDto.description,
      operatorId: createRecordDto.operatorId,
      storeId: createRecordDto.storeId, // 假设 store 字段存储的是 storeId
    };

    const record = this.customerRecordsRepository.create(recordData);
    return this.customerRecordsRepository.save(record);
  }

  async findCustomerRecords(customerId: string): Promise<CustomerRecord[]> {
    return this.customerRecordsRepository.find({
      where: { customerId },
      relations: ['operator', 'store'],
      order: { createdAt: 'DESC' },
    });
  }
}
