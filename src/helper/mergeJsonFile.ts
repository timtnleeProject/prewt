import fs from "fs-extra";

export default (...filepathOrJsons: (string | Record<string, string>)[]) => {
  const jsons = filepathOrJsons.map((filepathOrJson) =>
    typeof filepathOrJson === "string"
      ? fs.readJSONSync(filepathOrJson, "utf-8")
      : filepathOrJson
  );
  const merged = jsons.reduce((json, curr) => Object.assign(json, curr), {});
  return merged;
};
