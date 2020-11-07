import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import {Request, Response} from "express";
import routes from "./routes/routes";
import { User } from "./entity/User";

createConnection().then(async connection => {

    // create express app
    const app = express();
		app.use(cors());
		app.use(helmet());
    app.use(bodyParser.json());
		app.use("/", routes);
    // register express routes from defined application routes
    // Routes.forEach(route => {
    //     (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
    //         const result = (new (route.controller as any))[route.action](req, res, next);
    //         if (result instanceof Promise) {
    //             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
		//
    //         } else if (result !== null && result !== undefined) {
    //             res.json(result);
    //         }
    //     });
    // });

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    // insert new users for test
	// const userRepository = connection.getRepository('User');
	// if (!await userRepository.findOne({ firstName: "Tyo" })) {
	// 	console.log('Database Empty! Adding Tyo.')
	// 	await connection.manager.save(connection.manager.create(User, {
	// 		firstName: "Tyo",
	// 		age: 27
	// 	}));
	// }

    console.log("Express server has started on port 3000.");

}).catch(error => console.log(error));
