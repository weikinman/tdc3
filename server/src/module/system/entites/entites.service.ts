import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { CreateEntitesDto, UpdateEntitesDto, ListEntitesDto } from './dto/index';
import { SysEntitesEntity } from './entities/entites.entity';
import { RedisService } from 'src/module/redis/redis.service';
import { CacheEnum } from 'src/common/enum/index';

@Injectable()
export class EntitesService {
  constructor(
    @InjectRepository(SysEntitesEntity)
    private readonly sysEntitesEntityRep: Repository<SysEntitesEntity>,
    private readonly redisService: RedisService,
  ) {}
  async create(createEntitesDto: CreateEntitesDto) {
    await this.sysEntitesEntityRep.save(createEntitesDto);
    return ResultData.ok();
  }

  async findAll(query: ListEntitesDto) {
    const entity = this.sysEntitesEntityRep.createQueryBuilder('entity');
    entity.where('entity.delFlag = :delFlag', { delFlag: '0' });

    if (query.entitesName) {
      entity.andWhere(`entity.entitesName LIKE "%${query.entitesName}%"`);
    }

    if (query.entitesKey) {
      entity.andWhere(`entity.entitesKey LIKE "%${query.entitesKey}%"`);
    }

    if (query.entitesType) {
      entity.andWhere('entity.entitesType = :entitesType', { entitesType: query.entitesType });
    }

    if (query.params?.beginTime && query.params?.endTime) {
      entity.andWhere('entity.createTime BETWEEN :start AND :end', { start: query.params.beginTime, end: query.params.endTime });
    }

    entity.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    const [list, total] = await entity.getManyAndCount();

    return ResultData.ok({
      list,
      total,
    });
  }

  async findOne(id: number) {
    const data = await this.sysEntitesEntityRep.findOne({
      where: {
        entitesId: id,
      },
    });
    return ResultData.ok(data);
  }

  /**
   * 根据配置键值异步查找一条配置信息。
   *
   * @param entitesKey 配置的键值，用于查询配置信息。
   * @returns 返回一个结果对象，包含查询到的配置信息。如果未查询到，则返回空结果。
   */
  async findOneByentitesKey(entitesKey: string) {
    // 尝试从Redis缓存中获取配置信息
    const cacheData = await this.redisService.storeGet(`${CacheEnum.SYS_CONFIG_KEY}${entitesKey}`);
    if (cacheData) {
      // 如果缓存中存在配置信息，则直接返回
      return ResultData.ok(cacheData);
    }

    // 从数据库中查询配置信息
    const data = await this.sysEntitesEntityRep.findOne({
      where: {
        entitesKey: entitesKey,
      },
    });
    // 将从数据库中查询到的配置信息存入Redis缓存
    await this.redisService.storeSet(`${CacheEnum.SYS_CONFIG_KEY}${entitesKey}`, data);
    return ResultData.ok(data);
  }

  async update(updateEntitesDto: UpdateEntitesDto) {
    await this.sysEntitesEntityRep.update(
      {
        entitesId: updateEntitesDto.entitesId,
      },
      updateEntitesDto,
    );
    return ResultData.ok();
  }

  async remove(ids: number[]) {
    const data = await this.sysEntitesEntityRep.update(
      { entitesId: In(ids) },
      {
        delFlag: '1',
      },
    );
    return ResultData.ok(data);
  }
}
