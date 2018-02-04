import settings from './settings';
import XHR from './xhr';
import helper from '../common/helper';

class RestArtClient {
  constructor(_settings) {
    this.settings = {};
    if (helper.isObject(_settings)) {
      this.settings.endpoint =
        settings.endpoints[_settings.endpointName || settings.defaultEndpoint];
      this.settings.apiPath =
        settings.apiPaths[_settings.apiPathName || settings.defaultApiPath];
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
    request.url = helper.pathJoin(this.settings.endpoint, this.settings.apiPath, service);
    return request;
  }

  post(service, data) {
    const request = new XHR();
    RestArtClient.setDefaultHeaders(request);
    request.method = 'POST';
    request.url = helper.pathJoin(this.settings.endpoint, this.settings.apiPath, service);
    request.data = data;
    return request;
  }

  put(service, data) {
    const request = new XHR();
    RestArtClient.setDefaultHeaders(request);
    request.method = 'PUT';
    request.url = helper.pathJoin(this.settings.endpoint, this.settings.apiPath, service);
    request.data = data;
    return request;
  }

  patch(service, data) {
    const request = new XHR();
    RestArtClient.setDefaultHeaders(request);
    request.method = 'PATCH';
    request.url = helper.pathJoin(this.settings.endpoint, this.settings.apiPath, service);
    request.data = data;
    return request;
  }

  delete(service) {
    const request = new XHR();
    RestArtClient.setDefaultHeaders(request);
    request.method = 'DELETE';
    request.url = helper.pathJoin(this.settings.endpoint, this.settings.apiPath, service);
    return request;
  }
}

export default RestArtClient;
