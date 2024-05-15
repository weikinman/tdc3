import { Injectable } from '@nestjs/common';
import { InjectEntityManager,InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {CreateEntityDto} from './dto/index'
import {ExtendBaseEntity} from './entities/entites.entity'
import {entityManager} from '../../../common/entities/manager'

@Injectable()
export class EntitiesService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRepository(ExtendBaseEntity)
    private readonly entitysRepo: Repository<ExtendBaseEntity>,
  ) {}


  async queryTable(tableName: string, id: number) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    return await queryRunner.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
  }

  async createTable(entityName: string, columns: { name: string; type: string }[]) {
    const entitys = entityManager.getEntitys();
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

  async addColumn(tableName: string, columnName: string, columnType: string) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
    await queryRunner.release();
  }

  async dropColumn(tableName: string, columnName: string) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(`ALTER TABLE ${tableName} DROP COLUMN ${columnName}`);
    await queryRunner.release();
  }


  // async createUser(email: string, name: string) {
  //   return this.userRepository
  //     .createQueryBuilder()
  //     .insert()
  //     .into(CreateEntityDto)
  //     .values({ entitesName: email })
  //     .execute();
  // }


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