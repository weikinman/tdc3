import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { CreateConfigDto, UpdateConfigDto, ListConfigDto } from './dto/index';
import { SysConfigEntity } from './entities/config.entity';
import { RedisService } from 'src/module/redis/redis.service';
import { CacheEnum } from 'src/common/enum/index';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(SysConfigEntity)
    private readonly sysConfigEntityRep: Repository<SysConfigEntity>,
    private readonly redisService: RedisService,
  ) {}
  async create(createConfigDto: CreateConfigDto) {
    await this.sysConfigEntityRep.save(createConfigDto);
    return ResultData.ok();
  }

  async findAll(query: ListConfigDto) {
    const entity = this.sysConfigEntityRep.createQueryBuilder('entity');
    entity.where('entity.delFlag = :delFlag', { delFlag: '0' });

    if (query.configName) {
      entity.andWhere(`entity.configName LIKE "%${query.configName}%"`);
    }

    if (query.configKey) {
      entity.andWhere(`entity.configKey LIKE "%${query.configKey}%"`);
    }

    if (query.configType) {
      entity.andWhere('entity.configType = :configType', { configType: query.configType });
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
    const data = await this.sysConfigEntityRep.findOne({
      where: {
        configId: id,
      },
    });
    return ResultData.ok(data);
  }

  /**
   * 根据配置键值异步查找一条配置信息。
   *
   * @param configKey 配置的键值，用于查询配置信息。
   * @returns 返回一个结果对象，包含查询到的配置信息。如果未查询到，则返回空结果。
   */
  async findOneByconfigKey(configKey: string) {
    // 尝试从Redis缓存中获取配置信息
    const cacheData = await this.redisService.storeGet(`${CacheEnum.SYS_CONFIG_KEY}${configKey}`);
    if (cacheData) {
      // 如果缓存中存在配置信息，则直接返回
      return ResultData.ok(cacheData);
    }

    // 从数据库中查询配置信息
    const data = await this.sysConfigEntityRep.findOne({
      where: {
        configKey: configKey,
      },
    });
    // 将从数据库中查询到的配置信息存入Redis缓存
    await this.redisService.storeSet(`${CacheEnum.SYS_CONFIG_KEY}${configKey}`, data);
    return ResultData.ok(data);
  }

  async update(updateConfigDto: UpdateConfigDto) {
    await this.sysConfigEntityRep.update(
      {
        configId: updateConfigDto.configId,
      },
      updateConfigDto,
    );
    return ResultData.ok();
  }

  async remove(ids: number[]) {
    const data = await this.sysConfigEntityRep.update(
      { configId: In(ids) },
      {
        delFlag: '1',
      },
    );
    return ResultData.ok(data);
  }
}
