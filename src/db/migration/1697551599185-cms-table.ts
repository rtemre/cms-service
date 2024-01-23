import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CmsTable1697551599185 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cms',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'contentData',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'contentType',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'language',
            type: 'varchar',
            isNullable: false,
            length: '5',
          },
          {
            name: 'createdBy',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'updatedBy',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      'cms',
      new TableUnique({ columnNames: ['contentType', 'language'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cms');
  }
}
