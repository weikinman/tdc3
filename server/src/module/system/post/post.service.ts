import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { SysPostEntity } from './entities/post.entity';

import { CreatePostDto, UpdatePostDto, ListPostDto } from './dto/index';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(SysPostEntity)
    private readonly sysPostEntityRep: Repository<SysPostEntity>,
  ) {}
  async create(createPostDto: CreatePostDto) {
    await this.sysPostEntityRep.save(createPostDto);
    return ResultData.ok();
  }

  async findAll(query: ListPostDto) {
    const entity = this.sysPostEntityRep.createQueryBuilder('entity');
    entity.where('entity.delFlag = :delFlag', { delFlag: '0' });

    if (query.postName) {
      entity.andWhere(`entity.postName LIKE "%${query.postName}%"`);
    }

    if (query.postCode) {
      entity.andWhere(`entity.postCode LIKE "%${query.postCode}%"`);
    }

    if (query.status) {
      entity.andWhere('entity.status = :status', { status: query.status });
    }

    entity.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    const [list, total] = await entity.getManyAndCount();

    return ResultData.ok({
      list,
      total,
    });
  }

  async findOne(id: number) {
    const res = await this.sysPostEntityRep.findOne({
      where: {
        postId: id,
        delFlag: '0',
      },
    });
    return ResultData.ok(res);
  }

  async update(updatePostDto: UpdatePostDto) {
    const res = await this.sysPostEntityRep.update({ postId: updatePostDto.postId }, updatePostDto);
    return ResultData.ok(res);
  }

  async remove(ids: number[]) {
    const data = await this.sysPostEntityRep.update(
      { postId: In(ids) },
      {
        delFlag: '1',
      },
    );
    return ResultData.ok(data);
  }
}
