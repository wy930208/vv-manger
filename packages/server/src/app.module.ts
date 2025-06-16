/*
 * @Description:
 * @Author: huangzhiwei
 * @Date: 2025-06-09 00:28:28
 * @Email: huangzhiwei4@joyy.sg
 * @LastEditTime: 2025-06-14 11:33:19
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { MenusModule } from './modules/menus/menus.module';
import { RolesModule } from './modules/roles/roles.module';
import { StoresModule } from './modules/stores/stores.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'vv_manager',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // 生产环境关闭自动同步
      migrations: ['dist/migrations/*.js'],
      migrationsRun: process.env.NODE_ENV === 'production', // 生产环境自动运行迁移
    }),
    AuthModule,
    UsersModule,
    CustomersModule,
    MenusModule,
    RolesModule,
    StoresModule,
  ],
})
export class AppModule {}
