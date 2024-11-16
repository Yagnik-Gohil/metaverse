import { MigrationInterface, QueryRunner } from 'typeorm';

export class Asset1731736396756 implements MigrationInterface {
  name = 'Asset1731736396756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."asset_status_enum" AS ENUM('active', 'in_active')`,
    );
    await queryRunner.query(
      `CREATE TABLE "asset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "base_url" character varying NOT NULL, "root" character varying NOT NULL, "folder" character varying NOT NULL, "name" character varying NOT NULL, "status" "public"."asset_status_enum" NOT NULL DEFAULT 'in_active', CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "asset"`);
    await queryRunner.query(`DROP TYPE "public"."asset_status_enum"`);
  }
}
