#!/usr/bin/env node
import sade from "sade";
import chalk from "chalk";
import path from "path";
import execa from "execa";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
const version = "1.0.0";
const prog = sade("prewt");
prog
    .version(version)
    .command("create <pkg_name>")
    .describe("Create project based on prewt structure.")
    .action(async (pkg_name, opt) => {
    await execa.commandSync(`mkdir ${pkg_name}`);
    initPkg(pkg_name);
});
const initPkg = (appName) => {
    let pkgMgmt;
    let appDir = `./${appName}`;
    inquirer
        .prompt({
        type: "list",
        name: "pkgMgmt",
        message: "Npm or Yarn?",
        choices: ["npm", "yarn"],
    })
        .then((answers) => {
        pkgMgmt = answers.pkgMgmt;
        /**
         * Copy the whole "template" folder into target dir
         * exclude node_modules, yarn.lock
         **/
        return fs.copy(path.resolve(__dirname, "./template"), appDir, {
            filter: (pathname) => {
                if (pathname.match(/(node_modules|yarn.lock)/))
                    return false;
                return true;
            },
        });
    })
        .then(() => {
        // set package.json name
        return fs.writeJSON(path.resolve(appDir, "./package.json"), {
            name: appName,
            author: "",
        });
    })
        .then(() => {
        const spinner = ora("Installing").start();
        spinner.color = "yellow";
        /**
         * move process to target dir
         **/
        process.chdir(appDir);
        /**
         * run "npm i" or "yarn"
         **/
        const command = pkgMgmt === "npm" ? "npm i" : "yarn";
        const { stdout } = execa.command(command);
        return new Promise((resolve, reject) => {
            stdout === null || stdout === void 0 ? void 0 : stdout.on("data", (data) => {
                console.log(data.toString());
            });
            stdout === null || stdout === void 0 ? void 0 : stdout.on("end", () => {
                spinner.stop();
                resolve();
            });
            stdout === null || stdout === void 0 ? void 0 : stdout.on("error", (e) => {
                reject(e);
            });
        });
    })
        .then(() => {
        console.log("DONE, to start development, run:");
        console.log(chalk.blue(`cd ./${appName}`));
        console.log(chalk.blue(`${pkgMgmt} start`));
    })
        .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        }
        else {
            // Something else went wrong
            console.log(error);
        }
    });
};
prog.parse(process.argv);
