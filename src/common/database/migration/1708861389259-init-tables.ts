import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1708861389259 implements MigrationInterface {
  name = 'InitTables1708861389259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" character varying NOT NULL, "user_id" character varying NOT NULL, "amount" double precision NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "fullname" character varying, "email" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'USER', "password" character varying, "accessTokenKey" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_b4a3d92d5dde30f3ab5c34c5862" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_b4a3d92d5dde30f3ab5c34c5862"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
