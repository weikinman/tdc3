import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base';

import { createDynamicClass } from '../../../../common/entities/manager'

export class ExtendBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'entity_id', comment: '' })
  public entityId: number;

  @Column({ type: 'varchar', name: 'entity_name', length: 100, default: '', comment: '名称' })
  public entityName: string;

}

Entity('sys_entites', {
  comment: '',
})(ExtendBaseEntity)