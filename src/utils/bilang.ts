const chalk = require('chalk');

const bilang = (color: string, text: string, error = "") => {
	const date = `\n-- [ ${Date()} ]`;
	let string;
  const err = error ? ` [ ${error} ]` : "";
 switch(color) {
	 case("red"):
	  string = chalk.red(text + err);
 	break;
	 case("green"):
	  string = chalk.green(text + err);
 	break;
	 default:
	 	string = "Failed to log, did you pass a color?"
 }
	console.log(string + date);
};

export default bilang;