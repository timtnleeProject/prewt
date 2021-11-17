import prettier from "prettier";
import { getPrettierrc } from "./configFile.js";

export const formatWithLocalPrettierConf = async (str: string, options: any = {}) => {
  const prettierConf = await getPrettierrc();
  return prettier.format(str, { ...prettierConf, ...options });
};
