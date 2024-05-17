import { Module, DynamicModule } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ModuleRef, LazyModuleLoader,NestContainer,GraphInspector } from '@nestjs/core';
import { InjectEntityManager,InjectRepository } from '@nestjs/typeorm';
import {DependenciesScanner} from '@nestjs/core/scanner'
import {MetadataScanner} from '@nestjs/core/metadata-scanner'
import {Injector} from '@nestjs/core/injector/injector'
import {InstanceLoader} from '@nestjs/core/injector/instance-loader'
import { Entity, EntityManager, Repository } from 'typeorm';

import { ResultData } from 'src/common/utils/result';
import { createDynamicController, createDynamicService,createDynamicModule } from '../entities/manager';
@Module({})
export class MyDynamicModule {
  static register(): DynamicModule {
    const dynamicProviders = []; // 動態提供者
    const dynamicControllers = []; // 動態控制器

    return {
      module: MyDynamicModule,
      providers: dynamicProviders,
      controllers: dynamicControllers,
    };
  }
}

let dependenciesScanner;
  let instanceLoader;
  let modulesContainer;
  let lazyModuleLoader;
function getLozyLoader(){
  
  // const dynamicModuleInstance = await this.moduleRef.create(module);
  // console.log('dynamicModuleInstance',dynamicModuleInstance)
  const nestContainer = new NestContainer();
  const graphInspector = new GraphInspector(nestContainer);
  dependenciesScanner = new DependenciesScanner(
    nestContainer,
    new MetadataScanner(),
    graphInspector,
  );

  const injector = new Injector();
  instanceLoader = new InstanceLoader(
    nestContainer,
    injector,
    graphInspector,
  //   new NoopLogger(),
  );
  modulesContainer = nestContainer.getModules();
  lazyModuleLoader = new LazyModuleLoader(
    dependenciesScanner,
    instanceLoader,
    nestContainer['moduleCompiler'],
    modulesContainer,
  );
}
export {
  lazyModuleLoader
}
export const dynamicModule = MyDynamicModule.register();