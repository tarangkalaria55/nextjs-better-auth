/* eslint-disable @typescript-eslint/no-require-imports */
/** biome-ignore-all lint/correctness/noUnusedVariables: <> */
// npm i -D fs-extra cross-spawn dotenv xml2js
const fs = require("fs-extra");
const path = require("node:path");
const { spawn } = require("cross-spawn");
const dotenv = require("dotenv");
const xml2js = require("xml2js");

const rootDir = process.cwd();
const publishDir = path.join(rootDir, "publish");
const standaloneDir = path.join(rootDir, ".next", "standalone");

const publishNextStaticDir = path.join(publishDir, ".next", "static");
const nextStaticDir = path.join(rootDir, ".next", "static");

// Parse command-line arguments
const args = process.argv.slice(2);
const envArgIndex = args.indexOf((arg) => arg === "--env");
const NODE_ENV =
	envArgIndex !== -1 && args[envArgIndex + 1]
		? args[envArgIndex + 1]
		: "production";

console.log(NODE_ENV);

// Helper to run commands
function runCommand(command, args, cwd) {
	return new Promise((resolve, reject) => {
		const proc = spawn(command, args, { stdio: "inherit", cwd });
		proc.on("close", (code) => {
			if (code !== 0) reject(new Error(`${command} ${args.join(" ")} failed`));
			else resolve();
		});
	});
}

function loadEnvFiles(projectDir) {
	const nodeEnv = NODE_ENV;
	const envFiles = [
		`.env.${nodeEnv}.local`,
		nodeEnv === "test" ? null : `.env.local`,
		`.env.${nodeEnv}`,
		`.env`,
	].filter(Boolean);

	const envData = {};

	for (const file of envFiles) {
		const fullPath = path.join(projectDir, file);
		if (fs.existsSync(fullPath)) {
			const parsed = dotenv.parse(fs.readFileSync(fullPath));
			Object.assign(envData, parsed);
		}
	}

	return envData;
}

async function injectEnvIntoWebConfig(
	fromWevConfigPath,
	toWevConfigPath,
	envParentDir,
) {
	const env = loadEnvFiles(envParentDir);
	const xml = await fs.readFile(fromWevConfigPath, "utf8");
	const parsed = await xml2js.parseStringPromise(xml);

	if (
		!parsed.configuration.appSettings ||
		(parsed.configuration.appSettings[0] &&
			typeof parsed.configuration.appSettings[0] === "string")
	) {
		parsed.configuration.appSettings = [{}];
	}

	if (!parsed.configuration.appSettings[0]?.add) {
		parsed.configuration.appSettings[0].add = [];
	}

	const appSettings = parsed.configuration.appSettings[0].add;

	for (const [key, value] of Object.entries(env)) {
		const existing = appSettings.find((item) => item.$.key === key);
		if (existing) {
			existing.$.value = value;
		} else {
			appSettings.push({ $: { key, value } });
		}
	}

	const builder = new xml2js.Builder();
	const newXml = builder.buildObject(parsed);
	await fs.writeFile(toWevConfigPath, newXml, "utf8");
}

async function convertServerJsToTs(serverJsPath, serverTsPath) {
	if (!(await fs.pathExists(serverJsPath))) {
		console.error("❌ server.js not found in project root");
		process.exit(1);
	}

	console.log("📖 Reading server.js...");
	let content = await fs.readFile(serverJsPath, "utf8");

	// Replace NODE_ENV assignment
	content = content.replace(
		/process\.env\.NODE_ENV\s*=\s*['"].*?['"]/,
		'process.env = { ...process.env, NODE_ENV: "production" }',
	);

	// Ensure process.env types are explicit (optional)
	content = content.replace(
		/(catch\s*\(\s*err\s*\)\s*=>\s*\{)/,
		"catch((err: Error) => {",
	);

	// Replace currentPort, hostname, keepAliveTimeout block
	const portBlockRegex =
		/const currentPort\s*=\s*parseInt\(process\.env\.PORT,\s*10\)\s*\|\|\s*3000/;
	const portBlockReplacement = `const isDev = process.env.NODE_ENV !== "production"; // production

const pipeName = process.env.PORT && isNaN(Number(process.env.PORT))
  ? process.env.PORT
  : undefined;
const portNumber = !pipeName ? Number(process.env.PORT) || 3000 : undefined;
const currentPort: string | number = pipeName ?? portNumber!;`;

	content = content.replace(portBlockRegex, portBlockReplacement);

	// Replace the keepAliveTimeout line
	const keepAlibeBlockRegex =
		/let keepAliveTimeout\s*=\s*parseInt\(process\.env\.KEEP_ALIVE_TIMEOUT,\s*10\)/;
	const keepAlibeBlockReplacement = `let keepAliveTimeout: number | undefined = parseInt(process.env.KEEP_ALIVE_TIMEOUT || "", 10);`;

	content = content.replace(keepAlibeBlockRegex, keepAlibeBlockReplacement);

	const regex = /isDev\s*:\s*false,/;
	const replacement = `isDev: isDev,`;

	content = content.replace(regex, replacement);

	// Replace (err) with (err: Error),
	const regex1 = /\(\s*err\s*\)/;
	const replacement1 = `(err: Error)`;

	content = content.replace(regex1, replacement1);

	// Optional: add TypeScript disable for no-require-imports
	if (
		!content.includes("eslint-disable @typescript-eslint/no-require-imports")
	) {
		content = `/* eslint-disable @typescript-eslint/no-require-imports */\n${content}`;
	}

	console.log("📝 Writing server.ts...");
	await fs.writeFile(serverTsPath, content, "utf8");

	console.log("✅ server.ts created at:", serverTsPath);
}

async function buildPublish() {
	try {
		console.log("🚧 Removing old publish folder...");
		await fs.remove(publishDir);

		console.log("📂 Creating new publish folder...");
		await fs.mkdirp(publishDir);

		console.log("📦 Copying standalone build...");
		await fs.copy(standaloneDir, publishDir);

		console.log("📦 Copying standalone build...");
		await fs.copy(nextStaticDir, publishNextStaticDir);

		console.log("📝 Compiling server.ts...");
		await runCommand("npx", ["tsc", "-p", "tsconfig.server.json"]);

		// console.log("📦 Copying server.js...");
		// await fs.copy(
		// 	path.join(rootDir, "server.js"),
		// 	path.join(publishDir, "server.js"),
		// );

		// console.log("📝 Compiling logger.ts...");
		// await runCommand("npx", [
		//   "tsc",
		//   "logger.ts",
		//   "--outDir",
		//   "publish",
		//   "--esModuleInterop",
		//   "--target",
		//   "ES2020",
		//   "--module",
		//   "commonjs",
		// ]);

		console.log("📄 Copying web.config...");
		await injectEnvIntoWebConfig(
			path.join(rootDir, "web.config"),
			path.join(publishDir, "web.config"),
			publishDir,
		);

		// console.log("📦 Installing production dependencies...");
		// await runCommand("npm", ["install", "--production", "--prefix", publishDir]);

		console.log("✅ Publish folder is ready!");
	} catch (err) {
		console.error("❌ Error building publish folder:", err);
		process.exit(1);
	}
}

buildPublish();
