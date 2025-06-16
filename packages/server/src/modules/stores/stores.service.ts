import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { QueryStoreDto } from './dto/query-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  create(createStoreDto: CreateStoreDto) {
    const store = this.storeRepository.create(createStoreDto);
    return this.storeRepository.save(store);
  }

  findAll(queryDto: QueryStoreDto) {
    const query = this.storeRepository.createQueryBuilder('store');

    if (queryDto.status) {
      query.andWhere('store.status = :status', { status: queryDto.status });
    }

    return query.getMany();
  }

  findOne(id: string) {
    return this.storeRepository.findOneBy({ id });
  }

  update(id: string, updateStoreDto: UpdateStoreDto) {
    return this.storeRepository.update(id, updateStoreDto);
  }

  remove(id: string) {
    return this.storeRepository.delete(id);
  }
}
