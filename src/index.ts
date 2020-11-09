require('dotenv').config()
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

    // start express server
    app.listen(3000);



    console.log("Express server has started on port 3000.");
    if (process.env.NODE_ENV === "dev") {

	    // insert new users for test
	    const userRepository = connection.getRepository('User');
	    if (!await userRepository.findOne({ username: "TyoWibowow" })) {
	    	console.log('Database Empty! Adding Tyo.')
	    	await connection.manager.save(connection.manager.create(User, {
	    		username: "TyoWibowow",
			    password: "test",
	    		role: "ADMIN"
	    	}));
	    }

    }

}).catch(error => console.log(error));
