import fs from "fs-extra";
import { log, LogType } from "./log.js";

enum PackageManager {
  NPM,
  YARN,
}

export const getPkgManagerType = () => {
  if (fs.pathExistsSync("./package-lock.json")) return PackageManager.NPM;
  if (fs.pathExistsSync("./yarn.lock")) return PackageManager.YARN;
  log(LogType.Error, 'No lock file found. please install first ("npm i" or "yarn")');
  process.exit();
};

export const installPackageCommand = (
  pkg: string | string[],
  { dev }: { dev: boolean }
) => {
  const manaager = getPkgManagerType();
  const pkgNames = Array.isArray(pkg) ? pkg.join(" ") : pkg;
  if (manaager === PackageManager.NPM)
    return `npm i ${pkgNames}` + (dev ? " --save-dev" : "");
  if (manaager === PackageManager.YARN)
    return `yarn add ${pkgNames}` + (dev ? " -D" : "");
  log(LogType.Error, "invalid pkg manager");
  process.exit();
};
