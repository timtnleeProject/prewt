import chalk, { Chalk, ChalkFunction } from "chalk";

export enum LogType {
  Error,
  Success,
  Info,
}
const typeMapper: Record<
  LogType,
  {
    title: string;
    bg: keyof Chalk;
    color: keyof Chalk;
  }
> = {
  [LogType.Error]: {
    title: "Error",
    bg: "bgRed",
    color: "red",
  },
  [LogType.Success]: {
    title: "Success",
    bg: "bgGreenBright",
    color: "greenBright",
  },
  [LogType.Info]: {
    title: "Info",
    bg: "bgBlueBright",
    color: "blueBright",
  },
};

export const log = (type: LogType, msg: string) => {
  const { title, bg, color } = typeMapper[type];
  console.log(
    `${(chalk[bg] as ChalkFunction)(title)} ${(chalk[color] as ChalkFunction)(msg)}`
  );
};
