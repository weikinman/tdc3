import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectEntityManager,InjectRepository } from '@nestjs/typeorm';
import { Entity, EntityManager, Repository } from 'typeorm';

import { ResultData } from 'src/common/utils/result';
import { MyDynamicModule, dynamicModule } from 'src/common/dynamicModules';
import { createDynamicController, createDynamicService,createDynamicModule } from '../entities/manager';

import {ExtendBaseEntity} from '../../module/system/entites/entities/entites.entity'
@Injectable()
export class DynamicService {
  constructor(
    private moduleRef: ModuleRef
  ) {}

  async createDynamicModule() {
        // const EntitiesController = createDynamicController();
        // const EntitiesService = createDynamicService();
        // dynamicModule.providers.push(EntitiesService);
        // dynamicModule.controllers.push(EntitiesController);
        const module = await createDynamicModule(ExtendBaseEntity)
        console.log('createDynamicModule',module)
        // this.moduleRef.create(module);
        // AppModules.push(module);
        // const repo = getEntityRepo(ExtendBaseEntity);
        // const res = await repo.save({ entityName });
    
        // return ResultData.ok();
      
    const dynamicModuleInstance = await this.moduleRef.create(module);
    console.log('dynamicModuleInstance',dynamicModuleInstance)
    // 可以进一步操作 dynamicModuleInstance
  }

}

Injectable()(DynamicService)