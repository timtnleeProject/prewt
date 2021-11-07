#!/usr/bin/env node
import sade from "sade";
import chalk from "chalk";
import path from "path";
import execa from "execa";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import { fileURLToPath } from "url";

// define __dirname for esm
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const version = "1.0.0";
const prog = sade("prewt");
prog
  .version(version)
  .command("create <pkg_name>")
  .describe("Create project based on prewt structure.")
  .action(async (pkg_name, opt) => {
    initPkg(pkg_name);
  });

const initPkg = (appName: string) => {
  let pkgMgmt: string;
  let appDir = `./${appName}`;
  const templateDir = path.resolve(__dirname, "../template");
  // handle dir exist
  if (fs.pathExistsSync(appDir)) {
    console.log(
      `folder "${chalk.yellow(appName)}" already exists, remove it or change a name.`
    );
    return;
  }
  // start
  inquirer
    .prompt({
      type: "list",
      name: "pkgMgmt",
      message: "Npm or Yarn?",
      choices: ["npm", "yarn"],
    })
    .then((answers) => {
      pkgMgmt = answers.pkgMgmt;
      return execa.commandSync(`mkdir ${appName}`);
    })
    .then(() => {
      /**
       * Copy the whole "template" folder into target dir
       * exclude node_modules, yarn.lock
       **/
      return fs.copy(templateDir, appDir, {
        filter: (pathname) => {
          if (pathname.match(/(node_modules|yarn.lock)/)) return false;
          return true;
        },
      });
    })
    .then(() => {
      // set package.json name
      // return fs.writeJSON(path.resolve(appDir, "./package.json"), {
      //   name: appName,
      //   author: "",
      // });
    })
    .then(() => {
      const spinner = ora("Installing...").start();
      spinner.color = "yellow";
      /**
       * move process to target dir
       **/
      process.chdir(appDir);
      /**
       * run "npm i" or "yarn"
       **/
      const command = pkgMgmt === "npm" ? "npm i" : "yarn";
      const proc = execa.command(command);
      proc.stdout?.pipe(process.stdout);
      return proc.finally(() => {
        spinner.stop();
      });
    })
    .then(() => {
      console.log("DONE, to start development, run:");
      console.log(chalk.blueBright(`cd ./${appName}`));
      console.log(chalk.blueBright(`${pkgMgmt} start`));
    })
    .catch((error) => {
      console.error(error);
    });
};

prog.parse(process.argv);
