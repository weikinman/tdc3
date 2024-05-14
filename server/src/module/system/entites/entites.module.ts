import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitesService } from './entites.service';
import { EntitesController } from './entites.controller';
import { SysEntitesEntity } from './entities/entites.entity';
@Module({
  imports: [TypeOrmModule.forFeature([SysEntitesEntity])],
  controllers: [EntitesController],
  providers: [EntitesService],
})
export class SysEntitesModule {}
