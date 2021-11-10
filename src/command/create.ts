import execa from "execa";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import prompts from "prompts";
import prettier from "prettier";
import ora from "ora";
import mergeJsonFile from "../helper/mergeJsonFile.js";
import { templateDir } from "../paths.js";

const createApp = (appName: string) => {
  let pkgMgmt: string;
  let appDir = `./${appName}`;
  // handle dir exist
  if (fs.pathExistsSync(appDir)) {
    console.log(
      `folder "${chalk.yellow(appName)}" already exists, remove it or change a name.`
    );
    return;
  }
  // start
  prompts({
    type: "select",
    name: "pkgMgmt",
    message: "Npm or Yarn?",
    choices: [
      { title: "npm", value: "npm" },
      { title: "yarn", value: "yarn" },
    ],
  })
    .then((answers: { pkgMgmt: string }) => {
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
      // set package.json fileds
      const appDirJson = path.resolve(appDir, "./package.json");
      const templateDirJson = path.resolve(templateDir, "./package.json");
      const str = JSON.stringify(
        mergeJsonFile(templateDirJson, {
          name: appName,
          author: "",
        })
      );
      return fs.writeFile(appDirJson, prettier.format(str, { parser: "json" }));
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
    .catch((error: Error) => {
      console.error(error);
    });
};

export default createApp;
