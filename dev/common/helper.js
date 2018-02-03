module.exports = {
  isObject: (val) => {
    return Object.prototype.toString.call(val) === '[object Object]';
  },

  isArray: (val) => {
    return Object.prototype.toString.call(val) === '[object Array]';
  },
};
