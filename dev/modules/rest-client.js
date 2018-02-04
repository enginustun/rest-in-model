import settings from './settings';
import XHR from './xhr';
import helper from '../common/helper';

class RestArtClient {
  constructor(_settings) {
    this.settings = {
      endpoint: settings.endpoint,
      currentApiPath: settings.defaultApiPath,
    };
    if (helper.isObject(_settings)) {
      this.settings.endpoint = _settings.endpoint || settings.endpoint;
      this.settings.currentApiPath = _settings.currentApiPath || settings.defaultApiPath;
    }
  }

  static addApiPath(name, value) {
    settings.apiPaths[name] = value;
  }

  static setDefaultHeaders(request) {
    if (request instanceof XHR) {
      request.setHeader('Accept', settings.headers.accept);
      request.setHeader('Content-Type', settings.headers.contentType);
    }
  }

  get(service) {
    const request = new XHR();
    RestArtClient.setDefaultHeaders(request);
    request.method = 'GET';
    request.url = this.settings.endpoint +
      settings.apiPaths[this.settings.currentApiPath || settings.defaultApiPath] + service;
    return request;
  }

  post(service, data) {
    const request = new XHR();
    RestArtClient.setDefaultHeaders(request);
    request.method = 'POST';
    request.url = this.settings.endpoint +
      settings.apiPaths[this.settings.currentApiPath || settings.defaultApiPath] + service;
    request.data = data;
    return request;
  }

  put(service, data) {
    const request = new XHR();
    RestArtClient.setDefaultHeaders(request);
    request.method = 'PUT';
    request.url = this.settings.endpoint +
      settings.apiPaths[this.settings.currentApiPath || settings.defaultApiPath] + service;
    request.data = data;
    return request;
  }

  patch(service, data) {
    const request = new XHR();
    RestArtClient.setDefaultHeaders(request);
    request.method = 'PATCH';
    request.url = this.settings.endpoint +
      settings.apiPaths[this.settings.currentApiPath || settings.defaultApiPath] + service;
    request.data = data;
    return request;
  }

  delete(service) {
    const request = new XHR();
    RestArtClient.setDefaultHeaders(request);
    request.method = 'DELETE';
    request.url = this.settings.endpoint +
      settings.apiPaths[this.settings.currentApiPath || settings.defaultApiPath] + service;
    return request;
  }
}

export default RestArtClient;
