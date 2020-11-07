import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJWT = (req: Request, res: Response, next: NextFunction) => {
	// Get the JWT from request header
	console.log(req.headers);
	const token = <string>req.headers["authorization"];
	let jwtPayload;

	// Try to validate the token and get data
	try {
		jwtPayload = <any>jwt.verify(token, config.jwtSecret);
		res.locals.jwtPayload = jwtPayload;
	} catch(error) {
		// If token is not valid, respond with 401 (unauthorized)
		res.status(401).send();
		return;
	}

	// The token is valid for 24 hours
	// We want to send a new token on every request
	const { userId, username } = jwtPayload;
	const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
		expiresIn: "24h"
	});
	res.setHeader("token", newToken);

	// Call the next middleware or controller
	next();
}