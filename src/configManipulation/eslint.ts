export const addEslintPlugin = (plug: string) => (source: any) => {
  if (!source.plugins) source.plugins = [];
  source.plugins.push(plug);
  return source;
};
