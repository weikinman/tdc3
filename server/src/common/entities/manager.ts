
import { InjectEntityManager,InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { Entity, EntityManager, Repository } from 'typeorm';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultData } from 'src/common/utils/result';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { MyDynamicModule } from '../dynamicModules';
class EntityManagerBase {
    private entitys: any[];

    public repo;

        
    constructor() {
        this.entitys = [];
    }
    public add(entity) {
        this.entitys.push(entity);
    }

    setRepo(entity){
        return InjectRepository(entity);
    }

    public getEntitys() {
        return this.entitys;
    }
}

export const entityManagerBase = new EntityManagerBase();

//decorater
export function AddEntity(opts?) {

    return function (target?, props?) {
        entityManagerBase.add({
            target: target,
            name: props,
            opts,
            type: opts.type,
            length: opts.length,
        })
        // console.log('entityManagerBase',entityManagerBase.getEntitys(),target,props,opts)
    }
}


export function createDynamicClass(className) {
    return class {
      constructor() {
        console.log(`Created an instance of ${className}`);
      }
    };
}
class BaseService{
    async create(entityName: string,EntityEntities) {
        const repo = getEntityRepo(EntityEntities);
        const res = await repo.save({ entityName });
        return ResultData.ok();
    }
}
export function createDynamicService(){
    return class  extends BaseService{
    }
}


class BaseController{
    entitiesService;
    constructor(entitiesService) {
        this.entitiesService = entitiesService
    }
    @Post('/create')
    createTable(@Body() body: { entityName: string; columns: { name: string; type: string }[] }) {
        return this.entitiesService.createTable2(body.entityName, body.columns);
    }
    @Post('/addColumn')
    addColumn(@Body() body: { entityName: string; column: { name: string; type: string, length:string } }) {
        return this.entitiesService.addColumn(body.entityName, body.column.name,body.column.type,body.column.length);
    }
    @Get('/list')
    queryTable() {
        return this.entitiesService.getAllTableNames();
    }
}
export function createDynamicController(){
    const EntityController = class extends BaseController {
    }
    Controller('/testevent')(EntityController)
    return EntityController;
}
export function createDynamicModule(EntityEntities?){
    const SysEntitesModule = createDynamicClass('SysEntitesModule');
    const EntitiesController = createDynamicController();
    const EntitiesService = createDynamicService();
    Module({
        imports: [],
        controllers: [EntitiesController],
        providers: [EntitiesService],
        exports: [EntitiesService],
    })(SysEntitesModule) 

    return SysEntitesModule;
    // return MyDynamicModule.register()
}

export function createEntityService(){

}

export function getEntityRepo(entityDto):any{
    let obj = {
        repo:null
    };
    return InjectRepository(entityDto)(obj,'repo');
}