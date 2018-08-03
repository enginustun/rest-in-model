import settings from './settings';
import XHR from './xhr';
import helper from '../common/helper';

const setHeaders = (request, headers) => {
  if (request instanceof XHR) {
    const modelHeaderKeys = Object.keys(headers);
    for (let i = 0; i < modelHeaderKeys.length; i += 1) {
      const headerKey = modelHeaderKeys[i];
      if (
        headerKey.toLowerCase() !== 'content-type' ||
        !headers[headerKey].toLowerCase().includes('form-data')
      ) {
        request.setHeader(headerKey, headers[headerKey]);
      }
    }
  }
};

const getFormData = (contentType, data) => {
  let formData = data;
  if (contentType.includes('form-data')) {
    formData = helper.getFormData(data);
  } else if (contentType.includes('application/json')) {
    formData = JSON.stringify(formData);
  } else if (contentType.includes('x-www-form-urlencoded')) {
    formData = helper.appendQueryParamsToUrl('', formData);
    formData = formData.substr(1, formData.length);
  }
  return formData;
};

class RestClient {
  constructor(_settings) {
    this.settings = {};
    if (helper.isObject(_settings)) {
      this.settings.endpoint =
        settings.endpoints[_settings.endpointName || settings.defaultEndpoint];
      this.settings.apiPath =
        settings.apiPaths[_settings.apiPathName || settings.defaultApiPath];
    }
  }

  sendRequest({ method = 'GET', service, data = null, headers = {} }) {
    if (
      !headers['Content-Type'] &&
      !headers['content-Type'] &&
      !headers['content-type'] &&
      !headers['contentType']
    ) {
      headers['Content-Type'] = settings.headers.contentType;
    }
    const request = new XHR();
    setHeaders(request, headers);
    request.method = method;
    request.url = helper.pathJoin(
      this.settings.endpoint,
      this.settings.apiPath,
      service
    );
    if (data) {
      request.data = getFormData(
        (headers['Content-Type'] || '').toLowerCase(),
        data
      );
    }
    return request;
  }

  get(service, headers) {
    return this.sendRequest({ service, headers });
  }

  post(service, data, headers) {
    return this.sendRequest({ method: 'POST', service, data, headers });
  }

  put(service, data, headers) {
    return this.sendRequest({ method: 'PUT', service, data, headers });
  }

  patch(service, data, headers) {
    return this.sendRequest({ method: 'PATCH', service, data, headers });
  }

  delete(service, headers) {
    return this.sendRequest({ method: 'DELETE', service, headers });
  }
}

export default RestClient;
