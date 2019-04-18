import RestClient from './modules/rest-client';
import RestBaseModel from './modules/base-model';
import _settings from './modules/settings';
import helper from './common/helper';

const settings = {
  addEndpoint: endpoint => {
    if (helper.isObject(endpoint) && endpoint.name && endpoint.value) {
      _settings.endpoints[endpoint.name] = endpoint.value;
      if (endpoint.default) {
        if (_settings.defaultEndpoint) {
          throw new Error('There can be only one default endpoint');
        }
        _settings.defaultEndpoint = endpoint.name;
      }
    } else if (helper.isArray(endpoint)) {
      endpoint.map(item => {
        if (item.name && item.value) {
          _settings.endpoints[item.name] = item.value;
          if (item.default) {
            if (_settings.defaultEndpoint) {
              throw new Error('There can be only one default endpoint');
            }
            _settings.defaultEndpoint = item.name;
          }
        }
      });
    } else {
      throw new Error(
        'Endpoint provided is not valid or its format is wrong. Correct format is { name = "", value = "" }.'
      );
    }
  },
  addApiPath: apiPath => {
    if (helper.isObject(apiPath) && apiPath.name && apiPath.value) {
      _settings.apiPaths[apiPath.name] = apiPath.value;
    } else if (helper.isArray(apiPath)) {
      apiPath.map(item => {
        if (item.name && item.value) {
          _settings.apiPaths[item.name] = item.value;
          if (item.default) {
            if (_settings.defaultApiPath) {
              throw new Error('There can be only one default api path');
            }
            _settings.defaultApiPath = item.name;
          }
        }
      });
    } else {
      throw new Error(
        'ApiPaths provided is not valid or its format is wrong. Correct format is { name = "", value = "" }.'
      );
    }
  },
  setDefaultEndpoint: endpointName => {
    if (endpointName && typeof endpointName === 'string') {
      if (_settings.endpoints[endpointName]) {
        _settings.defaultEndpoint = endpointName;
      } else {
        throw new Error(
          'Endpoint name provided must be added to endpoints before.'
        );
      }
    } else {
      throw new Error(
        'Default endpoint name must be provided and its type must be string.'
      );
    }
  },
  setDefaultApiPath: apiPathName => {
    if (apiPathName && typeof apiPathName === 'string') {
      if (_settings.apiPaths[apiPathName]) {
        _settings.defaultApiPath = apiPathName;
      } else {
        throw new Error(
          'API path name provided must be added to ApiPaths before.'
        );
      }
    } else {
      throw new Error(
        'Default api path name must be provided and its type must be string.'
      );
    }
  },
  setTimeout: duration => {
    _settings.timeout = duration;
  },
  setHeader: _settings.setHeader,
  set beforeEveryRequest(func = helper.defaultFunction) {
    _settings.beforeEveryRequest = func;
  },
  set afterEveryRequest(func = helper.defaultFunction) {
    _settings.afterEveryRequest = func;
  },
  set: (configs = {}) => {
    configs.endpoints && settings.addEndpoint(configs.endpoints);
    configs.apiPaths && settings.addApiPath(configs.apiPaths);
    configs.defaultEndpoint &&
      settings.setDefaultEndpoint(configs.defaultEndpoint);
    configs.defaultApiPath &&
      settings.setDefaultApiPath(configs.defaultApiPath);
    configs.timeout && settings.setTimeout(configs.timeout);
    helper.isObject(configs.headers) &&
      Object.entries(configs.headers).map(config =>
        settings.setHeader(config[0], config[1])
      );
    if (configs.beforeEveryRequest) {
      settings.beforeEveryRequest = beforeEveryRequest;
    }
    if (configs.afterEveryRequest) {
      settings.afterEveryRequest = afterEveryRequest;
    }
  },
};

export { RestClient, RestBaseModel, settings };
