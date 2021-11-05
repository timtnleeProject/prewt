#!/usr/bin/env node
const sade = require("sade");
const rl = require("readline");
const path = require("path");
const execa = require("execa");
const fs = require("fs-extra");
const inquirer = require("inquirer");

const ignorePatterns = ["//"];
console.log("ya");

const version = "1.0.0";
const prog = sade("tool");
prog
  .version(version)
  .command("create <pkg_name>")
  .describe("hahahahha")
  .action(async (pkg_name, opt) => {
    await execa.commandSync(`mkdir ${pkg_name}`);
    initPkg(pkg_name);
  });

const initPkg = (pkg_name) => {
  let pkgMgmt;
  let appDir = `./${pkg_name}`;
  inquirer
    .prompt({
      type: "list",
      name: "pkgMgmt",
      message: "Npm or Yarn?",
      choices: ["npm", "yarn"],
    })
    .then((answers) => {
      pkgMgmt = answers.pkgMgmt;
      // Use user feedback for... whatever!!
      return fs.copy(path.resolve(__dirname, "./template"), appDir, {
        filter: (pathname) => {
          if (pathname.match(/(node_modules|yarn.lock)/)) return false;
          return true;
        },
      });
    })
    .then(() => {
      console.log("installing...");
      process.chdir(appDir);
      const command = pkgMgmt === "npm" ? "npm i" : "yarn";
      const { stdout } = execa.command(command);

      return new Promise((resolve, reject) => {
        stdout.on("data", (data) => {
          console.log(data.toString());
        });
        stdout.on("end", () => {
          resolve();
        });
        stdout.on("error", (e) => {
          reject(e);
        });
      });
    })
    .then(() => {
      console.log("done");
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
        console.log(error);
      }
    });
};

prog.parse(process.argv);
