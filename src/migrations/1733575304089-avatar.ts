import { MigrationInterface, QueryRunner } from 'typeorm';

export class Avatar1733575304089 implements MigrationInterface {
  name = 'Avatar1733575304089';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "avatar" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "tile_size" integer NOT NULL, "image_id" uuid, CONSTRAINT "REL_8222444786d26614b033abaead" UNIQUE ("image_id"), CONSTRAINT "PK_50e36da9d45349941038eaf149d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "avatar_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "avatar" ADD CONSTRAINT "FK_8222444786d26614b033abaeadb" FOREIGN KEY ("image_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_b777e56620c3f1ac0308514fc4c" FOREIGN KEY ("avatar_id") REFERENCES "avatar"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_b777e56620c3f1ac0308514fc4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "avatar" DROP CONSTRAINT "FK_8222444786d26614b033abaeadb"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar_id"`);
    await queryRunner.query(`DROP TABLE "avatar"`);
  }
}
