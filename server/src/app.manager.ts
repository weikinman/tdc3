import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from './config/index';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthModule } from './module/system/auth/auth.module';
import { UserModule } from './module/system/user/user.module';
import { ToolModule } from './module/system/tool/tool.module';
import { DeptModule } from './module/system/dept/dept.module';
import { DictModule } from './module/system/dict/dict.module';
import { MenuModule } from './module/system/menu/menu.module';
import { RoleModule } from './module/system/role/role.module';
import { PostModule } from './module/system/post/post.module';
import { SysConfigModule } from './module/system/config/config.module';
import { NoticeModule } from './module/system/notice/notice.module';
import { MainModule } from './module/main/main.module';
import { RedisModule } from './module/redis/redis.module';
import { CacheModule } from './module/monitor/cache/cache.module';
import { LoginlogModule } from './module/monitor/loginlog/loginlog.module';
import { OperlogModule } from './module/monitor/operlog/operlog.module';
import { AxiosModule } from './module/axios/axios.module';
import { OnlineModule } from './module/monitor/online/online.module';
import { ServerModule } from './module/monitor/server/server.module';
import { UploadModule } from './module/upload/upload.module';
import { SysEntitesModule } from './module/system/entites/entites.module';
@Module({})
class AdditionalModule {}
let modules = [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
      // envFilePath: ['src/config/dev.yml'],
    }),
    // 数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          entities: [`${__dirname}/**/*.entity{.ts,.js}`],
          autoLoadEntities: true,
          keepConnectionAlive: true,
          timezone: 'Asia/Beijing',
          ...config.get('db.mysql'),
          // cache: {
          //   type: 'ioredis',
          //   ...config.get('redis'),
          //   alwaysEnabled: true,
          //   duration: 3 * 1000, // 缓存3s
          // },
        } as TypeOrmModuleOptions;
      },
    }),
    HttpModule,
    AuthModule,
    UserModule,
    ToolModule,
    DeptModule,
    DictModule,
    MenuModule,
    RoleModule,
    PostModule,
    SysConfigModule,
    NoticeModule,
    MainModule,
    RedisModule,
    CacheModule,
    LoginlogModule,
    OperlogModule,
    AxiosModule,
    OnlineModule,
    ServerModule,
    UploadModule,
    SysEntitesModule,
  ]
export const AppModules:DynamicModule = {
           module:AdditionalModule
}
