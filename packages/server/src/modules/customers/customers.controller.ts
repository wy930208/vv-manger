import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  //   UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerRecordDto } from './dto/create-customer-record.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('customers')
// @UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @Post(':id/records')
  createRecord(
    @Param('id') id: string,
    @Body() createRecordDto: CreateCustomerRecordDto,
  ) {
    // 确保DTO中的customerId与URL中的id一致
    createRecordDto.customerId = id;
    return this.customersService.createRecord(createRecordDto);
  }

  @Get(':id/records')
  findRecords(@Param('id') id: string) {
    return this.customersService.findCustomerRecords(id);
  }
}
