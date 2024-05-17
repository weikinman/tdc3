import { Controller, Post, Body, Get } from '@nestjs/common';
import { DynamicService } from './service';

@Controller('/dynamic')
export class DynamicController {
  constructor(private entitiesService: DynamicService) {}

  @Post('/create')
  createTable(@Body() body: { entityName: string; columns: { name: string; type: string }[] }) {
    this.entitiesService.createDynamicModule()
    console.log('test dynamic module')
  }

}