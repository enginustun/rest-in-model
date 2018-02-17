import RestArtClient from './rest-client';
import helper from '../common/helper';

const restModelToObject = (restModel, Type) => {
  const newObject = new Type();
  const config = Type[`${Type.name}_config`];
  if (helper.isObject(config.fields)) {
    const fieldKeys = Object.keys(config.fields);
    for (let i = 0; i < fieldKeys.length; i += 1) {
      const fieldKey = fieldKeys[i];
      newObject[fieldKey] = restModel[config.fields[fieldKey].map || fieldKey];
    }
  }
  return newObject;
};

const objectToRestModel = (model) => {
  const restModel = {};
  const config = model.constructor[`${model.constructor.name}_config`];
  if (helper.isObject(config.fields)) {
    const fieldKeys = Object.keys(config.fields);
    for (let i = 0; i < fieldKeys.length; i += 1) {
      const fieldKey = fieldKeys[i];
      restModel[config.fields[fieldKey].map || fieldKey] = model[fieldKey];
    }
  }
  return restModel;
};

const customHeaders = {};

const addCustomHeaders = (request) => {
  const customHeaderKeys = Object.keys(customHeaders);
  for (let i = 0; i < customHeaderKeys.length; i += 1) {
    const headerKey = customHeaderKeys[i];
    request.setHeader(headerKey, customHeaders[headerKey]);
  }
};

class RestArtBaseModel {
  constructor(options) {
    const opt = options || {};
    const { constructor } = this;
    const config = RestArtBaseModel[`${constructor.name}_config`];
    const { fields } = config;
    const fieldKeys = Object.keys(fields);

    // define each field of fields as model's field
    for (let i = 0; i < fieldKeys.length; i += 1) {
      const fieldKey = fieldKeys[i];
      this[fieldKey] = fields[fieldKey] ? fields[fieldKey].default : undefined;
    }

    // define REST consumer
    if (!constructor.consumer) {
      Object.defineProperty(constructor, 'consumer', {
        value: new RestArtClient({
          endpointName: opt.endpointName || config.endpointName,
          apiPathName: opt.apiPathName || config.apiPathName,
        }),
        writable: true,
      });
    }
  }

  static setConfig(name, value) {
    RestArtBaseModel[`${this.name}_config`] = RestArtBaseModel[`${this.name}_config`] || {};
    RestArtBaseModel[`${this.name}_config`][name] = value;
  }

  static setHeader(name, value) {
    customHeaders[name] = value;
  }

  save(options) {
    const { constructor } = this;
    const config = RestArtBaseModel[`${constructor.name}_config`];
    const { fields } = config;
    const opt = options || {};
    const id = this[config.idField];
    const consumer = new RestArtClient({
      endpointName: opt.endpointName || config.endpointName,
      apiPathName: opt.apiPathName || config.apiPathName,
    });
    let path = 'default';
    path = opt.path || path;

    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        // if there is no id, then post and save it
        let request;
        if (!id) {
          request = consumer.post(config.paths[path], objectToRestModel(this));
          addCustomHeaders(request);
          request.exec()
            .then((response) => {
              this[config.idField] =
                response[config.fields[config.idField].map || config.idField];
              resolve(response);
            })
            .catch((response) => { reject(response); });
        } else if (helper.isArray(opt.patch)) {
          // if there is 'patch' attribute in option, only patch these fields
          const patchData = {};
          const convertedModel = objectToRestModel(this);
          for (let i = 0; i < opt.patch.length; i += 1) {
            const key = fields[opt.patch[i]].map || opt.patch[i];
            patchData[key] = convertedModel[key];
          }
          request = consumer.patch(
            helper.pathJoin(config.paths[path], id),
            patchData,
          );
          addCustomHeaders(request);
          request.exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        } else {
          // otherwise put all fields
          const putData = {};
          const convertedModel = objectToRestModel(this);
          const fieldKeys = Object.keys(convertedModel);
          for (let i = 0; i < fieldKeys.length; i += 1) {
            const key = fieldKeys[i];
            putData[key] = convertedModel[key];
          }
          delete putData[config.idField];
          request = consumer.put(
            helper.pathJoin(config.paths[path], id),
            putData,
          );
          addCustomHeaders(request);
          request.exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        }
      }
    });
  }

  static save(options) {
    const config = RestArtBaseModel[`${this.name}_config`];
    const opt = options || {};
    const { fields } = config;
    const consumer = new RestArtClient({
      endpointName: opt.endpointName || config.endpointName,
      apiPathName: opt.apiPathName || config.apiPathName,
    });
    let path = 'default';
    path = opt.path || path;
    if (!(opt.model instanceof this)) {
      throw Error('model must be provided as option parameter');
    }
    const id = opt.model[config.idField];

    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        // if there is no id, then post and save it
        let request;
        if (!id) {
          request = consumer.post(config.paths[path], objectToRestModel(opt.model));
          addCustomHeaders(request);
          request.exec()
            .then((response) => {
              opt.model[config.idField] =
                response[config.fields[config.idField].map || config.idField];
              resolve(response);
            })
            .catch((response) => { reject(response); });
        } else if (helper.isArray(opt.patch)) {
          // if there is 'patch' attribute in option, only patch these fields
          const patchData = {};
          const convertedModel = objectToRestModel(opt.model);
          for (let i = 0; i < opt.patch.length; i += 1) {
            const key = fields[opt.patch[i]].map || opt.patch[i];
            patchData[key] = convertedModel[key];
          }
          request = consumer.patch(
            helper.pathJoin(config.paths[path], id),
            patchData,
          );
          addCustomHeaders(request);
          request.exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        } else {
          // otherwise put all fields
          const putData = {};
          const fieldKeys = Object.keys(opt.model);
          for (let i = 0; i < fieldKeys.length; i += 1) {
            const key = fieldKeys[i];
            putData[key] = opt.model[key];
          }
          delete putData[config.idField];
          request = consumer.put(
            helper.pathJoin(config.paths[path], id),
            putData,
          );
          addCustomHeaders(request);
          request.exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        }
      }
    });
  }

  static get(options) {
    const opt = options || {};
    const config = RestArtBaseModel[`${this.name}_config`];
    const { id } = opt;
    const consumer = new RestArtClient({
      endpointName: opt.endpointName || config.endpointName,
      apiPathName: opt.apiPathName || config.apiPathName,
    });
    let path = 'default';
    path = opt.path || path;
    opt.pathData = opt.pathData || {};

    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        if (id) {
          // if there is no pathData.id it should be set
          opt.pathData.id = opt.pathData.id || id;
          let resultPath = config.paths[path];
          if (path === 'default') {
            resultPath = helper.pathJoin(config.paths[path], '{id}');
          }
          // replace url parameters and append query parameters
          resultPath = helper.appendQueryParamsToUrl(
            helper.replaceUrlParamsWithValues(resultPath, opt.pathData),
            opt.queryParams,
          );
          const request = consumer.get(resultPath);
          addCustomHeaders(request);
          request.exec()
            .then((response) => {
              const model = restModelToObject(opt.resultField && response[opt.resultField] ?
                response[opt.resultField] : response, this);
              resolve({ model, response });
            })
            .catch((response) => { reject(response); });
        } else {
          reject(new Error('id parameter must be provided in options or object\'s id field must be set before calling this method.'));
        }
      }
    });
  }

  static all(options) {
    const config = RestArtBaseModel[`${this.name}_config`];
    const opt = options || {};
    const consumer = new RestArtClient({
      endpointName: opt.endpointName || config.endpointName,
      apiPathName: opt.apiPathName || config.apiPathName,
    });
    let path = 'default';
    path = opt.path || path;
    opt.pathData = opt.pathData || {};

    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        let resultPath = helper.replaceUrlParamsWithValues(config.paths[path], opt.pathData);
        // replace url parameters and append query parameters
        resultPath = helper.appendQueryParamsToUrl(
          helper.replaceUrlParamsWithValues(resultPath, opt.pathData),
          opt.queryParams,
        );
        const request = consumer.get(resultPath);
        addCustomHeaders(request);
        request.exec()
          .then((response) => {
            if (!helper.isArray(opt.resultList)) { opt.resultList = []; }
            const list = opt.resultListField &&
              helper.isArray(response[opt.resultListField]) ?
              response[opt.resultListField] : response;
            opt.resultList.length = 0;
            for (let i = 0; i < list.length; i += 1) {
              const item = list[i];
              opt.resultList.push(restModelToObject(
                item,
                (opt.resultListItemType &&
                  opt.resultListItemType.prototype instanceof RestArtBaseModel ?
                  opt.resultListItemType : this),
              ));
            }
            resolve({ resultList: opt.resultList, response });
          })
          .catch((response) => { reject(response); });
      }
    });
  }

  delete(options) {
    const { constructor } = this;
    const config = RestArtBaseModel[`${constructor.name}_config`];
    const opt = options || {};
    const id = opt.id || this[config.idField];
    const consumer = new RestArtClient({
      endpointName: opt.endpointName || config.endpointName,
      apiPathName: opt.apiPathName || config.apiPathName,
    });
    let path = 'default';
    path = opt.path || path;

    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        if (id) {
          const request = consumer.delete(helper.pathJoin(config.paths[path], id));
          addCustomHeaders(request);
          request.exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        } else {
          reject(new Error('id parameter must be provided in options or object\'s id field must be set before calling this method.'));
        }
      }
    });
  }

  static delete(options) {
    const config = RestArtBaseModel[`${this.name}_config`];
    const opt = options || {};
    const { id } = opt;
    const consumer = new RestArtClient({
      endpointName: opt.endpointName || config.endpointName,
      apiPathName: opt.apiPathName || config.apiPathName,
    });
    let path = 'default';
    path = opt.path || path;

    return new Promise((resolve, reject) => {
      if (consumer instanceof RestArtClient) {
        if (id) {
          const request = consumer.delete(helper.pathJoin(config.paths[path], id));
          addCustomHeaders(request);
          request.exec()
            .then((response) => { resolve(response); })
            .catch((response) => { reject(response); });
        } else {
          reject(new Error('id parameter must be provided in options or object\'s id field must be set before calling this method.'));
        }
      }
    });
  }
}

export default RestArtBaseModel;
