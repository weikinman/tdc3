import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base';

@Entity('sys_entites', {
  comment: '参数配置表',
})
export class SysEntitesEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'entites_id', comment: '参数主键' })
  public entitesId: number;

  @Column({ type: 'varchar', name: 'entites_name', length: 100, default: '', comment: '参数名称' })
  public entitesName: string;

  @Column({ type: 'varchar', name: 'entites_key', length: 100, default: '', comment: '岗位编码' })
  public entitesKey: string;

  @Column({ type: 'varchar', name: 'entites_value', length: 500, default: '', comment: '参数键值' })
  public entitesValue: string;

  //系统内置（Y是 N否）
  @Column({ type: 'char', name: 'entites_type', length: 1, default: 'N', comment: '系统内置' })
  public entitesType: string;
}
