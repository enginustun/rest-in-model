module.exports = {
  isObject: val => Object.prototype.toString.call(val) === '[object Object]',

  isArray: val => Object.prototype.toString.call(val) === '[object Array]',

  pathJoin: (...paths) => {
    const pathArray = Array.prototype.slice.call(paths);
    let resultPath = '';
    for (let i = 0; i < pathArray.length; i += 1) {
      let pathItem = pathArray[i];
      if (pathItem) {
        const pathItemLength = pathItem.length;
        if (pathItemLength > 0) {
          if (pathItem[pathItemLength - 1] === '/') {
            pathItem = pathItem.substr(0, pathItemLength - 1);
          }
          if (pathItem[0] === '/') {
            pathItem = pathItem.substr(1, pathItemLength - 1);
          }
        }
        resultPath += ((resultPath.length > 0 ? '/' : '') + pathItem);
      }
    }
    return resultPath;
  },

  replaceUrlParamsWithValues: (url, paramValues) => {
    const paramKeys = Object.keys(paramValues);
    let newurl = url;
    for (let i = 0; i < paramKeys.length; i += 1) {
      const paramKey = paramKeys[i];
      newurl = newurl.replace(`{${paramKey}}`, paramValues[paramKey]);
    }
    return newurl;
  },
};
