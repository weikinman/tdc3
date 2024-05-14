import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { EntitesService } from './entites.service';
import { CreateEntitesDto, UpdateEntitesDto, ListEntitesDto } from './dto/index';

@ApiTags('参数设置')
@Controller('system/entites')
export class EntitesController {
  constructor(private readonly entitesService: EntitesService) {}

  @ApiOperation({
    summary: '参数设置-创建',
  })
  @ApiBody({
    type: CreateEntitesDto,
  })
  @Post()
  create(@Body() createEntitesDto: CreateEntitesDto) {
    return this.entitesService.create(createEntitesDto);
  }

  @ApiOperation({
    summary: '参数设置-列表',
  })
  @ApiBody({
    type: ListEntitesDto,
    required: true,
  })
  @Get('/list')
  findAll(@Query() query: ListEntitesDto) {
    return this.entitesService.findAll(query);
  }

  @ApiOperation({
    summary: '参数设置-详情(id)',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entitesService.findOne(+id);
  }

  @ApiOperation({
    summary: '参数设置-详情(entitesKey)【走缓存】',
  })
  @Get('/entitesKey/:id')
  findOneByentitesKey(@Param('id') entitesKey: string) {
    return this.entitesService.findOneByentitesKey(entitesKey);
  }

  @ApiOperation({
    summary: '参数设置-更新',
  })
  @Put()
  update(@Body() updateEntitesDto: UpdateEntitesDto) {
    return this.entitesService.update(updateEntitesDto);
  }

  @ApiOperation({
    summary: '参数设置-删除',
  })
  @Delete(':id')
  remove(@Param('id') ids: string) {
    const entitesIds = ids.split(',').map((id) => +id);
    return this.entitesService.remove(entitesIds);
  }
}
