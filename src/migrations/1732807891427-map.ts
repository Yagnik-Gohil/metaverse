import { MigrationInterface, QueryRunner } from 'typeorm';

export class Map1732807891427 implements MigrationInterface {
  name = 'Map1732807891427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "map" ADD "name" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "name"`);
  }
}
