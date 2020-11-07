import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {User} from "../entity/User";

export class CreateAdminUser1604783805503 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
	    let user = new User();
	    user.username = "test";
	    user.password = "test";
	    user.hashPassword();
	    user.role = "ADMIN";
	    const userRepository = getRepository(User);
	    await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
