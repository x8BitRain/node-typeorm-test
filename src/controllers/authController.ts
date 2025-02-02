import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {
	static login = async (req: Request, res: Response) => {
		// Check if email and password are present.
		console.log(req.body);
		let { email, password } = req.body;
		if (!(email && password)) {
			res.status(400).send();
		}

		// Get user from database
		const userRepository = getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail({where: { email }});
		} catch (error) {
			res.status(401).send();
			return
		}

		// Check if encrypted password matches
		if (!user.checkIfUnencryptedPasswordIsValid(password)) {
			res.status(401).send();
		}

		// Sign JWT, valid for 24 hours.
		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email
			},
			config.jwtSecret,
			{
				expiresIn: '24h'
			}
		);
		res.send(token);
	};

	static changePassword = async (req: Request, res: Response) => {
		// get ID from JWT
		const id = res.locals.jwtPayload.userId;
		// Parameters from body
		const { oldPassword, newPassword } = req.body;
		if (!(oldPassword && newPassword)) {
			res.status(400).send();
		}

		// Get user from database
		const userRepository = getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail(id);
		} catch (id) {
			res.status(401).send();
		}

		if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
			res.status(401).send();
			return;
		}

		user.password = newPassword;
		const errors = await validate(user);
		if (errors.length > 0) {
			res.status(400).send(errors);
			return
		}

		// Hash the new password and save.
		user.hashPassword();
		userRepository.save(user);

		res.status(204).send();
	}
}

export default AuthController;