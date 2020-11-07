import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../entity/User";
import bilang from "../utils/bilang";

class UserController {

	static listAll = async (req: Request, res: Response) => {
		// Get users from database
		const userRepository = getRepository(User);
		const users = await userRepository.find({
			select: ["id", "username", "role"] // Specify exactly what we respond with because otherwise it will also send passwords
		});
		res.send(users);
	}

	static getOneById = async (req: Request, res: Response) => {
		// ID comes from URL
		const id = req.params.id;
		// Get user from DB
		const userRepository = getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail(id, {
				select: ["id", "username", "role"]
			});
			} catch (error) {
				res.status(404).send("User not found");
			}
			res.status(200).send(user);
		};

	static createUser = async (req: Request, res: Response) => {
		// Get parameters from request body
		let { username, password, role } = req.body;
		let user = new User();
		let savedUser;
		user.username = username;
		user.password = password;
		user.role = role || "NORMAL";

		// Validate user parameters
		const errors = await validate(user);
		if (errors.length > 0) {
			res.status(400).send(errors);
			return
		}

		// Hash the password
		user.hashPassword();

		// Save user to DB, if it fails, the username is already in use
		const userRepository = getRepository(User);
		try {
			savedUser = await userRepository.save(user);
			bilang("green",`User ${savedUser.username} saved!`);
		} catch (error) {
			bilang("red",`User ${user.username} tried to sign up but`, error);
			res.status(409).send({
				message: "Username already in use."
			});
			return
		}

		//If all ok, send 201 response
		res.status(201).send({
			message: "User created!",
			id: savedUser.id
		});
	};

	static editUser = async (req: Request, res: Response) => {
		// ID from URL
		const id = req.params.id;

		// Values from body
		const { username, role } = req.body;

		// Try to find user in DB
		const userRepository = getRepository(User);
		let user;
		try {
			user = await userRepository.findOneOrFail(id);
		} catch(error) {
			// If user not found, respond with 404
			res.status(404).send("User not found");
			return
		}

		// Validate new values on model
		user.username = username;
		user.role = role;
		const errors = await validate(user);
		if (errors.length > 0) {
			res.status(400).send(errors);
			return;
		}

		// Save to DB, if it fails, username is already in use.
		try {
			await userRepository.save(user);
		} catch (e) {
			res.status(409).send("Username already in use");
		}
		// Home at last, send 204 for success.
		res.status(204).send("User successfully updated");
	}

	static deleteUser = async (req: Request, res: Response) => {
		// Get the ID from the URL
		const id = req.params.id;
		const userRepository = getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail(id);
		} catch (error) {
			res.status(404).send("User not found");
			return;
		}
		userRepository.delete(id);

		res.status(204).send("User successfully deleted");
	};

}

export default UserController;