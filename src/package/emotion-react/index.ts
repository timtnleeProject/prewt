import execa from "execa";
import { addBabelPlugins, setBabelPreset } from "../../configManipulation/babel.js";
import {
  getBabelrc,
  getEslintrc,
  getTsconfig,
  writeBabelrc,
  writeEslintrc,
  writeTsconfig,
} from "../../helper/configFile.js";
import { installPackageCommand } from "../../helper/installer.js";
import { setTsconfigField } from "../../configManipulation/typescript.js";
import { addEslintPlugin } from "../../configManipulation/eslint.js";
import { log, LogType } from "../../helper/log.js";

class Pipeline {
  source: any;

  constructor(source: any) {
    this.source = source;
  }

  pipe(fn: any) {
    this.source = fn(this.source);
    return this;
  }
}

export default async () => {
  // babel
  const babelrc = await getBabelrc();
  await writeBabelrc(
    new Pipeline(babelrc)
      .pipe(
        setBabelPreset("@babel/preset-react", {
          runtime: "automatic",
          importSource: "@emotion/react",
        })
      )
      .pipe(addBabelPlugins("@emotion")).source
  );
  // tsconfig
  const tsconfig = await getTsconfig();
  await writeTsconfig(
    new Pipeline(tsconfig).pipe(
      setTsconfigField(["compilerOptions", "jsxImportSource"], "@emotion/react")
    ).source
  );

  // eslint
  const eslintrc = await getEslintrc();
  await writeEslintrc(new Pipeline(eslintrc).pipe(addEslintPlugin("@emotion")).source);

  // install
  const step1 = execa.command(installPackageCommand("@emotion/react@11", { dev: false }));
  step1.stdout?.pipe(process.stdout);
  step1
    .then(() => {
      const step2 = execa.command(
        installPackageCommand(["@emotion/babel-plugin@11", "@emotion/eslint-plugin@11"], {
          dev: true,
        })
      );
      step2.stdout?.pipe(process.stdout);
      return step2;
    })
    .then(() => {
      log(LogType.Success, "finish");
    });
};
