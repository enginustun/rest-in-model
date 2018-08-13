const settings = {
  endpoints: {},
  defaultEndpoint: '',
  apiPaths: {
    default: '',
  },
  defaultApiPath: '',
  headers: {
    accept: 'application/json',
    contentType: 'application/json',
  },
  setHeader: (key, value) => {
    settings.headers[key] = value;
  },
  modelHeaders: {},
};
module.exports = settings;
