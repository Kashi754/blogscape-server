function convertToCamel(struct) {
  // convert array items to camel case
  if (struct instanceof Array) {
    return struct.map((item) => convertToCamel(item));
  }
  // else convert object keys to camel case
  else if (struct instanceof Object) {
    const camelCaseStruct = {};
    for (const key in struct) {
      const camelCaseKey = key.replace(/(\_\w)/g, (match) =>
        match[1].toUpperCase()
      );
      camelCaseStruct[camelCaseKey] = struct[key];
    }
    return camelCaseStruct;
  }
  // else convert string to camel case
  else if (struct instanceof String) {
    return struct.replace(/(\_\w)/g, (match) => match[1].toUpperCase());
  } else return;
}

module.exports = convertToCamel;
