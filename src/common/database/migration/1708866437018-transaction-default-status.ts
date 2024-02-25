import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionDefaultStatus1708866437018
  implements MigrationInterface
{
  name = 'TransactionDefaultStatus1708866437018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "status" DROP DEFAULT`,
    );
  }
}
