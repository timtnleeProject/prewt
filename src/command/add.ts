import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { log, LogType } from "../helper/log.js";
// define __dirname for esm
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (pkgName: string) => {
  const exist = await fs.pathExists(
    path.join(__dirname, "../package", pkgName, "index.js")
  );
  if (!exist) {
    log(LogType.Error, `${pkgName} is not a valid package.`);
    process.exit();
  }
  try {
    const pkg = await import(`../package/${pkgName}/index.js`);
    const setupPkg = pkg.default;
    setupPkg();
  } catch (e) {
    console.error(e);
  }
};
