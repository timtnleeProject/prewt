export const setBabelPreset =
  (name: string, setting: null | Record<string, string>) => (babelrc: any) => {
    if (!babelrc.presets) babelrc.presets = [];
    const presets = babelrc.presets;
    const presetNameOnlyIndex = presets.findIndex((preset: string) => preset === name);
    if (presetNameOnlyIndex !== -1) {
      presets[presetNameOnlyIndex] = setting ? [name, setting] : name;
      return babelrc;
    }
    const presetWithOptionIndex = presets.findIndex(
      (preset: [string, string]) => preset[0] === name
    );
    if (presetWithOptionIndex !== -1) {
      const [, option] = presets[presetWithOptionIndex];
      presets[presetWithOptionIndex] = [
        name,
        setting ? Object.assign(option, setting) : option,
      ];
      return babelrc;
    }
    return babelrc;
  };

export const addBabelPlugins = (plug: string | any[]) => (babelrc: any) => {
  if (!babelrc.plugins) babelrc.plugins = [];
  const plugins = babelrc.plugins;
  plugins.push(plug);
  return babelrc;
};
