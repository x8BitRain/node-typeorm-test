import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Unique,
	CreateDateColumn,
	UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty, IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs";
import IUserSettings from "./types/userTypes";

@Entity()
@Unique(["email"])
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@Column({ nullable: true})
	@Length(4, 32)
	@IsNotEmpty()
	username: string;

	@Column()
	@Length(8, 100)
	@IsNotEmpty()
	password: string;

	@Column()
	@IsNotEmpty()
	role: string;

	@Column({
		type: "json",
		enum: Object,
		default: {
			autoPaste: false,
			autoCopy: true,
			darkMode: false,
		}
	})
	settings: IUserSettings

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