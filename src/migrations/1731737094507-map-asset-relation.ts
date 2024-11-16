import { MigrationInterface, QueryRunner } from 'typeorm';

export class MapAssetRelation1731737094507 implements MigrationInterface {
  name = 'MapAssetRelation1731737094507';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "tile_set"`);
    await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "thumbnail"`);
    await queryRunner.query(`ALTER TABLE "map" ADD "tile_set_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "map" ADD CONSTRAINT "UQ_51cc93386ecd8992c0acc7ca0ca" UNIQUE ("tile_set_id")`,
    );
    await queryRunner.query(`ALTER TABLE "map" ADD "thumbnail_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "map" ADD CONSTRAINT "UQ_ede13a59fac6c586e4d647d7b96" UNIQUE ("thumbnail_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "map" ADD CONSTRAINT "FK_51cc93386ecd8992c0acc7ca0ca" FOREIGN KEY ("tile_set_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "map" ADD CONSTRAINT "FK_ede13a59fac6c586e4d647d7b96" FOREIGN KEY ("thumbnail_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "map" DROP CONSTRAINT "FK_ede13a59fac6c586e4d647d7b96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "map" DROP CONSTRAINT "FK_51cc93386ecd8992c0acc7ca0ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "map" DROP CONSTRAINT "UQ_ede13a59fac6c586e4d647d7b96"`,
    );
    await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "thumbnail_id"`);
    await queryRunner.query(
      `ALTER TABLE "map" DROP CONSTRAINT "UQ_51cc93386ecd8992c0acc7ca0ca"`,
    );
    await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "tile_set_id"`);
    await queryRunner.query(
      `ALTER TABLE "map" ADD "thumbnail" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "map" ADD "tile_set" character varying NOT NULL`,
    );
  }
}
