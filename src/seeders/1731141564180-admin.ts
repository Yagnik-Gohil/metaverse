import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt'; // If you are hashing passwords
import { Admin } from '../modules/admin/entities/admin.entity';

export class Admin1731141564180 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hash the password before saving
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    // Insert the admin user
    await queryRunner.manager.insert(Admin, {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback the seeding by deleting the admin user
    await queryRunner.manager.delete(Admin, {
      email: process.env.ADMIN_EMAIL, // Find by unique value (email)
    });
  }
}
