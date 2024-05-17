import { Module, DynamicModule } from '@nestjs/common';

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

export const dynamicModule = MyDynamicModule.register();