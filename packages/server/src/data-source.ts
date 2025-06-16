import { DataSource } from 'typeorm';
import { User } from './modules/users/entities/user.entity';
import { Role } from './modules/roles/entities/role.entity';
import { RoleMenu } from './modules/roles/entities/role-menu.entity';
import { Menu } from './modules/menus/entities/menu.entity';
import { Store } from './modules/stores/entities/store.entity';
import { Customer } from './modules/customers/entities/customer.entity';
import { CustomerRecord } from './modules/customers/entities/customer-record.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'vv_manager',
  entities: [User, Role, RoleMenu, Menu, Store, Customer, CustomerRecord],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // 生产环境应设为 false
});
