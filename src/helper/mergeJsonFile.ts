import fs from "fs-extra";

export default (...filePaths: string[]) => {
  const jsons = filePaths.map((filepath) =>
    JSON.parse(fs.readFileSync(filepath, "utf-8"))
  );
  const merged = jsons.reduce((json, curr) => Object.assign(json, curr), {});
  return merged;
};
