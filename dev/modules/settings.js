const settings = {
  endpoints: {},
  defaultEndpoint: '',
  apiPaths: {
    default: '',
  },
  defaultApiPath: '',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
  setHeader: (key, value) => {
    settings.headers[key] = value;
  },
  modelHeaders: {},
  beforeEveryRequest: () => {},
  afterEveryRequest: () => {},
};
module.exports = settings;
