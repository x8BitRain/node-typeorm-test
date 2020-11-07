import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Unique,
	CreateDateColumn,
	UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["username"])
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	@Length(4, 32)
	username: string;

	@Column()
	@Length(8, 100)
	password: string;

	@Column()
	@IsNotEmpty()
	role: string;

	@Column()
	@CreateDateColumn()
	createdAt: Date;

	@Column()
	@UpdateDateColumn()
	updatedAt: Date;

	hashPassword() {
		this.password = bcrypt.hashSync(this.password, 16);
	}

	checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
		return bcrypt.compareSync(unencryptedPassword, this.password);
	}
}