import { Injectable } from '@nestjs/common';
import { InjectEntityManager,InjectRepository } from '@nestjs/typeorm';
import { Entity, EntityManager, Repository } from 'typeorm';
import {CreateEntityDto} from './dto/index'
import {ExtendBaseEntity} from './entities/entites.entity'
import {entityManagerBase, getEntityRepo} from '../../../common/entities/manager'

import { createDynamicClass } from '../../../common/entities/manager'

import { ResultData } from 'src/common/utils/result';

export class EntitiesService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRepository(ExtendBaseEntity)
    private readonly entitysRepo: Repository<ExtendBaseEntity>,
  ) {}

  async create(entityName: string) {
    const repo = getEntityRepo(ExtendBaseEntity);
    const res = await repo.save({ entityName });

    return ResultData.ok();
  }
async createTable2(entityName: string, columns: { name: string; type: string }[]) {
    const entitys = entityManagerBase.getEntitys();
    console.log('entity',entitys);
    
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    let columnsSQL =  entitys.map(entity=>{
      let lenStr = entity.length?`(${entity.length})`:'';
      return `${entity.name} ${entity.type}${lenStr}`
    }).join(', ');
    
    //columns.map(col => `${col.name} ${col.type}`).join(', ');
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS ${entityName} (${columnsSQL})`);
    await queryRunner.release();

    const dynamicClass = createDynamicClass(entityName);
    Entity(entityName)(dynamicClass)
    console.log('columnsSQL',columnsSQL)
  }

  async queryTable(tableName: string, id: number) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    return await queryRunner.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
  }

  async createTable(entityName: string, columns: { name: string; type: string }[]) {
    const entitys = entityManagerBase.getEntitys();
    console.log('entity',entitys);
    
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    let columnsSQL =  entitys.map(entity=>{
      let lenStr = entity.length?`(${entity.length})`:'';
      return `${entity.name} ${entity.type}${lenStr}`
    }).join(', ');
    
    console.log('columnsSQL',columnsSQL)
    //columns.map(col => `${col.name} ${col.type}`).join(', ');
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS ${entityName} (${columnsSQL})`);
    await queryRunner.release();
  }

  async addColumn(tableName: string, columnName: string, columnType: string, columntLength: string) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    let lenStr = columntLength?`(${columntLength})`:'';
    await queryRunner.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}${lenStr}`);
    await queryRunner.release();
  }

  async dropColumn(tableName: string, columnName: string) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(`ALTER TABLE ${tableName} DROP COLUMN ${columnName}`);
    await queryRunner.release();
  }

  async createUser(tableName:string, email: string, name: string): Promise<void> {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.query(
      `INSERT INTO ${tableName}(email, name) VALUES ($1, $2)`,
      [email, name]
    );
  }
 
  
  async getTableStructure(tableName: string): Promise<any> {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    const result = await queryRunner.query(`SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = $1`, [tableName]);
    await queryRunner.release();
    return result;
  }

  async getAllTableNames(): Promise<string[]> {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    const tables = await queryRunner.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'`);
    await queryRunner.release();
    return tables.map(table => { 
      return table.TABLE_NAME; 
    });
  }
}

Injectable()(EntitiesService)