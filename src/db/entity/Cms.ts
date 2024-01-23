import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export interface ICreateCmsData {
  contentType: string;
  contentData: string;
  createdBy: number;
  updatedBy: number;
  language: string;
}

export interface IUpdateCmsData {
  contentData: string;
  updatedBy: number;
  language?: string;
}

export interface ICmsQueryParams {
  page: number;
  pageSize: number;
  language?: string;
}

@Entity('cms')
@Unique(['contentType', 'language'])
export class Cms {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  contentData: string;

  @Column({ type: 'varchar', nullable: false })
  contentType: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  language: string;

  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @Column({ type: 'int', nullable: false })
  updatedBy: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @BeforeInsert()
  transformContentTypeToLowerCase() {
    this.contentType = this.contentType.toLowerCase();
  }
}
