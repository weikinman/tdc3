import { IsString, IsJSON, IsEnum, IsPhoneNumber, Min, Length, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PagingDto } from 'src/common/dto/index';

export enum StatusEnum {
  STATIC = '0',
  DYNAMIC = '1',
}
export enum TypeEnum {
  YES = 'Y',
  NO = 'N',
}
export class CreateEntitesDto {
  @IsString()
  @Length(0, 100)
  entitesName: string;

  @IsString()
  @Length(0, 500)
  entitesValue?: string;

  @IsString()
  @Length(0, 100)
  entitesKey?: string;

  @IsString()
  @IsEnum(TypeEnum)
  entitesType: string;

  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  remark?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;
}

export class EntityColumn {
  name:string
}


export class UpdateEntitesDto extends CreateEntitesDto {
  @IsNumber()
  entitesId: number;
}

export class ListEntitesDto extends PagingDto {
  @IsOptional()
  @IsString()
  @Length(0, 100)
  entitesName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  entitesKey?: string;

  @IsOptional()
  @IsString()
  @IsEnum(TypeEnum)
  entitesType?: string;
}



export class CreateEntityDto {
  @IsString()
  @Length(0, 100)
  entitesName: string;
}