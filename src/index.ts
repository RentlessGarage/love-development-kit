import { program } from "commander";
import fs from "fs";
import path from "path";
import Project from "./project";
import { bundleProject } from "./actions";
import Logger from "./logger";
import chalk from "chalk";

program
	.name("ldk")
	.description("Bundle, test, and distribute LOVE2D games with ease.")
	.version("0.2.0");

	program.command("init")
	.description("Creates an empty LOVE2D project.")
	.action(() => {
		Logger.warn("Not implemented yet.");
	});

program.command("bundle")
	.description("Bundles the current project into a .love file")
	.action(() => {
		fs.readFile(path.resolve(process.cwd(), "ldk.project.json"), (err, data) => {
			if (err) {
				throw err;
			}

			const project = Project.fromString(data.toString());
			bundleProject(project);
		});
	});

program.command("dev")
	.description("Bundles the current project, then runs it.")
	.action(() => {
		fs.readFile(path.resolve(process.cwd(), "ldk.project.json"), (err, data) => {
			if (err) {
				throw err;
			}

			const project = Project.fromString(data.toString());
			bundleProject(project).finally(() => {
				Logger.info("Running", `${project.name}...`, chalk.greenBright("✔"));
				Bun.spawn(["love", `./build/${project.name}.love`], {
					cwd: process.cwd(),
					env: {...process.env},
					stdout: "inherit"
				});
			})
		});
	});

program.parse()