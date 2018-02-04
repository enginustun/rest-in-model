module.exports = {
  isObject: val => Object.prototype.toString.call(val) === '[object Object]',

  isArray: val => Object.prototype.toString.call(val) === '[object Array]',

  pathJoin: (...paths) => {
    let resultPath = '';
    for (let i = 0; i < paths.length; i += 1) {
      let pathItem = paths[i];
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
    return resultPath;
  },
};
