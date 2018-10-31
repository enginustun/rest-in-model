import settings from './settings';

const isValid = value => {
  return value || value === undefined;
};

class XHR {
  constructor() {
    this.xhr = new XMLHttpRequest();
    this.method = 'GET';
    this.async = true;
    this.url = '';
    this.data = {};
    this.headers = {};
  }

  setHeader(name, value) {
    this.headers[name] = value;
  }

  exec({ beforeRequest = () => {}, afterRequest = () => {} } = {}) {
    return new Promise((resolve, reject) => {
      this.xhr.open(this.method, this.url, this.async);
      const headerKeys = Object.keys(this.headers);
      for (let i = 0; i < headerKeys.length; i += 1) {
        this.xhr.setRequestHeader(headerKeys[i], this.headers[headerKeys[i]]);
      }
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          settings.afterEveryRequest(this.xhr);
          afterRequest(this.xhr);
          if (this.xhr.status >= 200 && this.xhr.status < 300) {
            let data = this.xhr.responseText;
            const contentType = (
              this.xhr.getResponseHeader('Content-Type') || ''
            ).toLowerCase();
            if (
              this.xhr.responseText &&
              contentType.includes('application/json')
            ) {
              data = JSON.parse(this.xhr.responseText);
            }
            resolve(data);
          } else {
            try {
              reject(JSON.parse(this.xhr.responseText || this.xhr.statusText));
            } catch (error) {
              reject(new Error(this.xhr.statusText));
            }
          }
        }
      };
      isValid(settings.beforeEveryRequest(this.xhr)) &&
        isValid(beforeRequest(this.xhr)) &&
        this.xhr.send(this.data);
    });
  }
}

export default XHR;
