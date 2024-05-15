import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesService } from './entites.service';
import { EntitiesController } from './entites.controller';
import { ExtendBaseEntity } from './entities/entites.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ExtendBaseEntity])],
  controllers: [EntitiesController],
  providers: [EntitiesService],
})
export class SysEntitesModule {}
