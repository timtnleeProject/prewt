export const setTsconfigField = (names: string[], value: string) => (source: any) => {
  let pointer = source;
  names.forEach((name, i) => {
    const last = i === names.length - 1;
    if (last) pointer[name] = value;
    else {
      if (!pointer[name]) {
        pointer[name] = {};
      }
      pointer = pointer[name];
    }
  });
  return source;
};
