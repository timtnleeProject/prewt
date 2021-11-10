import path from "path";
import { fileURLToPath } from "url";

// define __dirname for esm
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const srcDir = __dirname;
export const templateDir = path.resolve(__dirname, "../template");
