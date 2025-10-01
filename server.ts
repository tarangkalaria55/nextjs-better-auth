import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import path from "node:path";

import nextConfig from "./next.config"

const dir = path.join(__dirname);
process.chdir(__dirname);

const dev = process.env.NODE_ENV !== "production"; // production

const pipeName =
	process.env.PORT && Number.isNaN(Number(process.env.PORT))
		? process.env.PORT
		: undefined;
const portNumber = !pipeName ? Number(process.env.PORT) || 3000 : undefined;
const port = pipeName ?? portNumber ?? 3000;
// const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({
	dev,
	dir: dir,
	conf: nextConfig
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = createServer((req, res) => {
		const parsedUrl = parse(req.url || "", true);
		handle(req, res, parsedUrl);
	});

	server.listen(port);

	const address = server.address()
	if(!address){
		console.log(`> Ready on http://`);
	}else if(typeof address !== "string"){
		console.log(`> Ready on http://${address.address}:${address.port}`);
	}else{
		console.log(`> Ready on http://${address}`);
	}

});
