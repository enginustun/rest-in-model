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

  exec() {
    return new Promise((resolve, reject) => {
      this.xhr.open(this.method, this.url, this.async);
      const headerKeys = Object.keys(this.headers);
      for (let i = 0; i < headerKeys.length; i += 1) {
        this.xhr.setRequestHeader(headerKeys[i], this.headers[headerKeys[i]]);
      }
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === 200) {
            // we get the returned data
            const data = JSON.parse(this.xhr.responseText);
            resolve(data);
          } else {
            reject(new Error(this.xhr.statusText));
          }
        }
      };
      this.xhr.send(JSON.stringify(this.data));
    });
  }
}

export default XHR;
