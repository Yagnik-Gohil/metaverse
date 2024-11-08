import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminAndToken1731082129220 implements MigrationInterface {
  name = 'AdminAndToken1731082129220';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "token" ADD "admin_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_5f202bdd180719e440aa50a9fd5" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_5f202bdd180719e440aa50a9fd5"`,
    );
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "admin_id"`);
    await queryRunner.query(`DROP TABLE "admin"`);
  }
}
