#!/usr/bin/env node
import sade from "sade";
import path from "path";
import { fileURLToPath } from "url";
import createApp from "./command/create.js";
import add from "./command/add.js";

// define __dirname for esm
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const version = "1.0.0";
const prog = sade("prewt");
prog
  .version(version)
  .command("create <app_name>")
  .describe("Create project based on prewt structure.")
  .action(async (app_name, opt) => {
    createApp(app_name);
  });
prog
  .command("add <pkg_name>")
  .describe("Add spoort package and setup related configuration.")
  .action((pkg_name, opt) => {
    add(pkg_name);
  });

prog.parse(process.argv);
