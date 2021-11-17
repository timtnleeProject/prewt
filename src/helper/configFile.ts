import fs from "fs-extra";
import { formatWithLocalPrettierConf } from "./format.js";
import { log, LogType } from "./log.js";

const getBabelrcPath = () => "./.babelrc";
const getTsconfigPath = () => "./tsconfig.json";
const getPrettierrcPath = () => "./.prettierrc";
const getEslintrcPath = () => "./.eslintrc.json";
// utils
const checkFileExist = async (filePath: string) => {
  const exist = await fs.pathExists(filePath);
  if (!exist) {
    log(LogType.Error, `${filePath} config not found.`);
    process.exit();
  }
};

const readJsonConfigFile = async (filePath: string) => {
  checkFileExist(filePath);
  const json = (await fs.readJSON(filePath)) as JSON;
  return json;
};

const writeJsonConfigFile = async (filePath: string, json: JSON) => {
  checkFileExist(filePath);

  const formatted = await formatWithLocalPrettierConf(JSON.stringify(json), {
    parser: "json",
  });

  await fs.writeFile(filePath, formatted);
  log(LogType.Info, `write ${filePath}`);
  return;
};

// babel
export const getBabelrc = async () => {
  const filePath = getBabelrcPath();
  const babelrc = await readJsonConfigFile(filePath);
  return babelrc;
};

export const writeBabelrc = async (json: JSON) => {
  const filePath = getBabelrcPath();
  await writeJsonConfigFile(filePath, json);
};

// prettier
export const getPrettierrc = async () => {
  const filePath = getPrettierrcPath();
  const prettierrc = await readJsonConfigFile(filePath);
  return prettierrc;
};

// tsconfig
export const getTsconfig = async () => {
  const filePath = getTsconfigPath();
  const tsconfig = await readJsonConfigFile(filePath);
  return tsconfig;
};

export const writeTsconfig = async (json: JSON) => {
  const filePath = getTsconfigPath();
  await writeJsonConfigFile(filePath, json);
};

// eslint
export const getEslintrc = async () => {
  const filePath = getEslintrcPath();
  const eslintrc = await readJsonConfigFile(filePath);
  return eslintrc;
};

export const writeEslintrc = async (json: JSON) => {
  const filePath = getEslintrcPath();
  await writeJsonConfigFile(filePath, json);
};
