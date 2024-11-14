import { MigrationInterface, QueryRunner } from 'typeorm';

export class Map1731596622851 implements MigrationInterface {
  name = 'Map1731596622851';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "map" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "row" integer NOT NULL, "column" integer NOT NULL, "tile_size" integer NOT NULL, "layers" jsonb NOT NULL, "solid_tile" integer array NOT NULL, "tile_set" character varying NOT NULL, "thumbnail" character varying NOT NULL, CONSTRAINT "PK_3b08de72489b3d4471b74516819" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "map"`);
  }
}
