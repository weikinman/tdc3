import { Controller, Post, Body, Get } from '@nestjs/common';
import { EntitiesService } from './entites.service';

@Controller('/system/entites')
export class EntitiesController {
  constructor(private entitiesService: EntitiesService) {}

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
  // 添加更多的端点以支持列的添加、删除等
}